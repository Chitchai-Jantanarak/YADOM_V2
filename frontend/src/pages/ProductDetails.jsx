"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Save,
  X,
  Trash2,
  ArrowLeft,
  Edit,
  PlusCircle,
  MinusCircle,
  Check,
  AlertTriangle,
  Info,
  Package,
} from "lucide-react"
import { productService } from "../services/productService"
import { getProductAssetPath, getFallbackAssetPath } from "../utils/fileUtils"
import { handleImageError } from "../utils/imageUtils"
import ModelViewer from "../components/ui/ModelViewer"
import { ROLES, authService } from "../services/authService"
import { useApi } from "../hooks/useApi"

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNewProduct = id === "new"

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    type: "MAIN_PRODUCT",
    localUrl: "",
    bones: [],
    colors: [],
    status: "AVAILABLE",
  })

  const [loading, setLoading] = useState(!isNewProduct)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [aromas, setAromas] = useState([])
  const [selectedAromas, setSelectedAromas] = useState([])
  const [modelLoadError, setModelLoadError] = useState(false)
  const [userRole, setUserRole] = useState(null)

  // Use the useApi hook for updating product status
  const { execute: executeStatusUpdate, loading: statusUpdateLoading } = useApi(productService.updateProductStatus)

  useEffect(() => {
    // Get user role
    const getCurrentUserRole = async () => {
      try {
        const user = await authService.getCurrentUser()
        setUserRole(user?.role)
      } catch (err) {
        console.error("Error getting user role:", err)
      }
    }

    getCurrentUserRole()

    if (!isNewProduct) {
      fetchProduct()
    }

    // Fetch aromas for selection
    fetchAromas()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProductById(id)

      setProduct({
        ...data,
        price: data.price?.toString() || "",
      })

      setLoading(false)
    } catch (err) {
      console.error("Error fetching product:", err)
      setError("Failed to load product. Please try again.")
      setLoading(false)
    }
  }

  const fetchAromas = async () => {
    try {
      // This would be replaced with your actual aroma service call
      // const data = await aromaService.getAromas()
      // Mock data for now
      const data = {
        aromas: [
          { id: 1, name: "Mint", price: 5.99 },
          { id: 2, name: "Lavender", price: 6.99 },
          { id: 3, name: "Citrus", price: 4.99 },
          { id: 4, name: "Vanilla", price: 7.99 },
        ],
      }
      setAromas(data.aromas)
    } catch (err) {
      console.error("Error fetching aromas:", err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = async (newStatus) => {
    if (isNewProduct) {
      // For new products, just update the local state
      setProduct((prev) => ({
        ...prev,
        status: newStatus,
      }))
      return
    }

    try {
      // For existing products, update via API
      const result = await executeStatusUpdate(id, newStatus)
      if (result) {
        setProduct((prev) => ({
          ...prev,
          status: newStatus,
        }))
        setSuccess(`Product status updated to ${newStatus.toLowerCase()}`)
      }
    } catch (err) {
      setError("Failed to update product status. Please try again.")
    }
  }

  const handleAromaToggle = (aromaId) => {
    if (selectedAromas.includes(aromaId)) {
      setSelectedAromas((prev) => prev.filter((id) => id !== aromaId))
    } else {
      setSelectedAromas((prev) => [...prev, aromaId])
    }
  }

  const handleModelLoad = (gltf) => {
    console.log("Model loaded successfully:", gltf)
    setModelLoadError(false)
  }

  const handleModelError = (err) => {
    console.error("Error loading model:", err)
    setModelLoadError(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!product.name || !product.price) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      setError(null)

      // For new products, we'll need to save the file after getting the product ID
      // For existing products, we'll update the path based on the product type
      let localUrl = product.localUrl

      // If it's a new product, set a pending upload path
      if (isNewProduct) {
        localUrl = "pending_upload"
      } else {
        // For existing products, use the correct path based on type
        localUrl = getProductAssetPath({
          id,
          type: product.type,
        })
      }

      const productData = {
        ...product,
        price: Number.parseFloat(product.price),
        localUrl: localUrl,
        // Add selected aromas if needed
        // aromas: selectedAromas.map(id => ({ id }))
      }

      let result
      if (isNewProduct) {
        result = await productService.createProduct(productData)

        // Now that we have the product ID, we can update the localUrl
        if (result.id) {
          const updatedLocalUrl = getProductAssetPath({
            id: result.id,
            type: product.type,
          })

          // Update the product with the correct path
          await productService.updateProduct(result.id, {
            ...productData,
            localUrl: updatedLocalUrl,
          })
        }
      } else {
        // For existing products, just update
        result = await productService.updateProduct(id, productData)
      }

      setSuccess(isNewProduct ? "Product created successfully!" : "Product updated successfully!")

      // If new product, redirect to the edit page of the new product
      if (isNewProduct && result.id) {
        navigate(`/dashboard/products/${result.id}`)
      }

      setSaving(false)
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Failed to save product. Please try again.")
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await productService.deleteProduct(id)
      navigate("/dashboard/products")
    } catch (err) {
      console.error("Error deleting product:", err)
      setError("Failed to delete product. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Get the asset path for the current product
  const assetPath = !isNewProduct
    ? getProductAssetPath({
        id,
        type: product.type,
      })
    : null

  // Check if user can delete products
  const canDeleteProducts = userRole === ROLES.OWNER

  return (
    <div className="container md:pl-72 py-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/products" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNewProduct ? "Add New Product" : `Edit ${product.name}`}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/products")}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span className="text-white">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {userRole !== ROLES.ADMIN && (
        <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2" />
            <span>
              This application uses local assets from the <code className="bg-amber-100 px-1 rounded">/assets/</code>{" "}
              directory. Make sure to place your 3D models in{" "}
              <code className="bg-amber-100 px-1 rounded">/assets/models/products/</code> and images in{" "}
              <code className="bg-amber-100 px-1 rounded">/assets/images/products/</code> with the product ID as the
              filename.
            </span>
          </div>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image/Model and Status */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              {product.type === "MAIN_PRODUCT" ? "3D Model" : "Product Image"}
            </h2>

            {/* Display the 3D model viewer for MAIN_PRODUCT */}
            {product.type === "MAIN_PRODUCT" && !isNewProduct && (
              <ModelViewer
                modelUrl={assetPath}
                productId={id} // Pass the product ID directly
                onModelLoad={handleModelLoad}
                onModelError={handleModelError}
                onModelFetch={(resolvedPath) => {
                  console.log("Model fetch attempt with path:", resolvedPath)
                }}
              />
            )}

            {/* Display image for ACCESSORY */}
            {product.type === "ACCESSORY" && !isNewProduct && (
              <div className="mt-4">
                <div className="border-2 border-gray-300 rounded-lg h-64 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={assetPath || getFallbackAssetPath("ACCESSORY")}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, "product", product.name)}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Image path: {assetPath || "Not available"}</p>
              </div>
            )}

            {isNewProduct && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center">
                <Package className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Save the product first to reference assets</p>
                <p className="text-xs text-gray-400 mt-2">
                  Assets should be placed in the appropriate directory with the product ID as the filename
                </p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Status</h2>

              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={product.status === "AVAILABLE"}
                    onChange={() => handleStatusChange("AVAILABLE")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 ${
                      product.status === "AVAILABLE" ? "bg-blue-500 text-white" : "border border-gray-300"
                    }`}
                  >
                    {product.status === "AVAILABLE" && <Check className="h-4 w-4" />}
                  </div>
                  <span>Available</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={product.status === "UNAVAILABLE"}
                    onChange={() => handleStatusChange("UNAVAILABLE")}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center mr-2 ${
                      product.status === "UNAVAILABLE" ? "bg-blue-500 text-white" : "border border-gray-300"
                    }`}
                  >
                    {product.status === "UNAVAILABLE" && <Check className="h-4 w-4" />}
                  </div>
                  <span>Unavailable</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {product.status === "AVAILABLE"
                  ? "Product will be visible to customers"
                  : "Product will be hidden from customers"}
              </p>
            </div>

            {!isNewProduct && canDeleteProducts && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                  <span>Delete Product</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Product Details</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
            >
              <div className="grid gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name Product <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={product.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MAIN_PRODUCT">Main Product</option>
                    <option value="ACCESSORY">Accessory</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Aroma Types Selection (for MAIN_PRODUCT) */}
                {product.type === "MAIN_PRODUCT" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compatible Aroma Types</label>
                    <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                      {aromas.length === 0 ? (
                        <p className="text-gray-500 text-sm">No aromas available</p>
                      ) : (
                        <div className="space-y-2">
                          {aromas.map((aroma) => (
                            <label key={aroma.id} className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedAromas.includes(aroma.id)}
                                onChange={() => handleAromaToggle(aroma.id)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                                  selectedAromas.includes(aroma.id)
                                    ? "bg-blue-500 text-white"
                                    : "border border-gray-300"
                                }`}
                              >
                                {selectedAromas.includes(aroma.id) && <Check className="h-3 w-3" />}
                              </div>
                              <span className="text-sm">
                                {aroma.name} (${aroma.price.toFixed(2)})
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Color Options (for ACCESSORY) */}
                {product.type === "ACCESSORY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color Options</label>
                    <div className="border border-gray-300 rounded-md p-4">
                      {product.colors && product.colors.length > 0 ? (
                        <div className="space-y-2">
                          {product.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.colorCode }}
                              />
                              <span className="text-sm">{color.colorName || color.colorCode}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <p className="text-gray-500 text-sm mb-2">No colors added yet</p>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <PlusCircle size={16} />
                            <span>Add Color</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bones Configuration (for MAIN_PRODUCT) */}
                {product.type === "MAIN_PRODUCT" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">3D Configuration Bones</label>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <PlusCircle size={16} />
                        <span>Add Bone</span>
                      </button>
                    </div>
                    <div className="border border-gray-300 rounded-md p-4">
                      {product.bones && product.bones.length > 0 ? (
                        <div className="space-y-3">
                          {product.bones.map((bone, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{bone.name}</p>
                                <p className="text-xs text-gray-500">
                                  Style: {bone.defaultStyle} {bone.isConfiguration && "• Configurable"}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" className="text-blue-600 hover:text-blue-800">
                                  <Edit size={16} />
                                </button>
                                <button type="button" className="text-red-600 hover:text-red-800">
                                  <MinusCircle size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <p className="text-gray-500 text-sm">No bones configured yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

