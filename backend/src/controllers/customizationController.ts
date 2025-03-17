import type { Request, Response, NextFunction } from "express"
import { prisma } from "../index"
import { ApiError } from "../middleware/errorMiddleware"

// @desc    Create a modified bone group
// @route   POST /api/customization
// @access  Public/Private
export const createModifiedBoneGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, modifiedBones, shareStatus } = req.body

    // If user is authenticated, use their ID, otherwise use the provided one
    const actualUserId = req.user ? req.user.id : userId

    if (!actualUserId) {
      return next(ApiError.badRequest("User ID is required"))
    }

    if (!modifiedBones || !Array.isArray(modifiedBones) || modifiedBones.length === 0) {
      return next(ApiError.badRequest("Modified bones are required"))
    }

    // Create the modified bone group
    const modifiedBoneGroup = await prisma.modifiedBoneGroup.create({
      data: {
        userId: actualUserId,
        shareStatus: shareStatus || false,
      },
    })

    // Create the modified bones
    for (const bone of modifiedBones) {
      if (!bone.boneId || !bone.modDetail) {
        continue // Skip invalid bones
      }

      await prisma.modifiedBone.create({
        data: {
          boneId: bone.boneId,
          modDetail: bone.modDetail,
          modifiedBoneGroupId: modifiedBoneGroup.id,
        },
      })
    }

    // Get the complete modified bone group with its bones
    const completeModifiedBoneGroup = await prisma.modifiedBoneGroup.findUnique({
      where: { id: modifiedBoneGroup.id },
      include: {
        modifiedBones: {
          include: {
            bone: true,
          },
        },
      },
    })

    res.status(201).json(completeModifiedBoneGroup)
  } catch (error) {
    next(error)
  }
}

// @desc    Get a modified bone group
// @route   GET /api/customization/:id
// @access  Public/Private
export const getModifiedBoneGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const modifiedBoneGroup = await prisma.modifiedBoneGroup.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        modifiedBones: {
          include: {
            bone: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!modifiedBoneGroup) {
      return next(ApiError.notFound("Modified bone group not found"))
    }

    // Check if the user is authorized to view this group
    if (
      !modifiedBoneGroup.shareStatus &&
      req.user &&
      req.user.id !== modifiedBoneGroup.userId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "OWNER"
    ) {
      return next(ApiError.forbidden("Not authorized to view this customization"))
    }

    res.json(modifiedBoneGroup)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's modified bone groups
// @route   GET /api/customization/user/:userId
// @access  Private
export const getUserModifiedBoneGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    // Check if the user is authorized
    if (req.user.id !== Number.parseInt(userId) && req.user.role !== "ADMIN" && req.user.role !== "OWNER") {
      return next(ApiError.forbidden("Not authorized to view these customizations"))
    }

    const modifiedBoneGroups = await prisma.modifiedBoneGroup.findMany({
      where: { userId: Number.parseInt(userId) },
      include: {
        modifiedBones: {
          include: {
            bone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.json(modifiedBoneGroups)
  } catch (error) {
    next(error)
  }
}

// @desc    Update a modified bone group
// @route   PUT /api/customization/:id
// @access  Private
export const updateModifiedBoneGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { shareStatus, modifiedBones } = req.body

    const modifiedBoneGroup = await prisma.modifiedBoneGroup.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!modifiedBoneGroup) {
      return next(ApiError.notFound("Modified bone group not found"))
    }

    // Check if the user is authorized
    if (req.user.id !== modifiedBoneGroup.userId && req.user.role !== "ADMIN" && req.user.role !== "OWNER") {
      return next(ApiError.forbidden("Not authorized to update this customization"))
    }

    // Update the modified bone group
    const updatedModifiedBoneGroup = await prisma.modifiedBoneGroup.update({
      where: { id: Number.parseInt(id) },
      data: {
        shareStatus: shareStatus !== undefined ? shareStatus : modifiedBoneGroup.shareStatus,
      },
    })

    // Update modified bones if provided
    if (modifiedBones && modifiedBones.length > 0) {
      // Delete existing modified bones
      await prisma.modifiedBone.deleteMany({
        where: { modifiedBoneGroupId: Number.parseInt(id) },
      })

      // Create new modified bones
      for (const bone of modifiedBones) {
        if (!bone.boneId || !bone.modDetail) {
          continue // Skip invalid bones
        }

        await prisma.modifiedBone.create({
          data: {
            boneId: bone.boneId,
            modDetail: bone.modDetail,
            modifiedBoneGroupId: Number.parseInt(id),
          },
        })
      }
    }

    // Get the complete updated modified bone group
    const completeUpdatedModifiedBoneGroup = await prisma.modifiedBoneGroup.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        modifiedBones: {
          include: {
            bone: true,
          },
        },
      },
    })

    res.json(completeUpdatedModifiedBoneGroup)
  } catch (error) {
    next(error)
  }
}

