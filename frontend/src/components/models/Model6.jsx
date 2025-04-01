"use client"

import React, { forwardRef } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Using forwardRef to allow the component to be used with react-spring's 'a' function
const Model6 = forwardRef(({ opacity = 1, ...props }, ref) => {
  const { nodes, materials } = useGLTF("/src/assets/models/model6.glb")

  // Create custom materials with the provided color and opacity
  const customMaterial1 = React.useMemo(() => {
    const material = materials["Material.001"].clone()
    material.opacity = opacity
    material.transparent = opacity < 1
    return material
  }, [opacity, materials])

  const customMaterial2 = React.useMemo(() => {
    const material = materials["Material.002"].clone()
    material.opacity = opacity
    material.transparent = opacity < 1
    return material
  }, [opacity, materials])

  // Set an extremely large scale for the group
  const groupScale = 200 // Increased from 100 to 200

  return (
    <group ref={ref} {...props} scale={groupScale} dispose={null}>
      <mesh geometry={nodes.Mesh1.geometry} material={customMaterial1} scale={3.1} castShadow receiveShadow />
      <mesh geometry={nodes.Mesh1003.geometry} material={customMaterial2} scale={3.1} castShadow receiveShadow />
    </group>
  )
})

// Add display name for debugging purposes
Model6.displayName = "Model6"

// Preload the model to improve performance
useGLTF.preload("/src/assets/models/model6.glb")

export default Model6

