"use client"

import React, { forwardRef } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

// Using forwardRef to allow the parent component to access this component's ref
const Model1_exp = forwardRef(({ color = "#1e88e5", opacity = 1, ...props }, ref) => {
  const { nodes, materials } = useGLTF("/src/assets/models/model1.glb")

  // Create a new material based on the original but with customizable color and opacity
  const customMaterial = React.useMemo(() => {
    const material = materials.plastic.clone()
    material.color = new THREE.Color(color)
    material.opacity = opacity
    material.transparent = opacity < 1
    return material
  }, [color, opacity, materials.plastic])

  return (
    <group ref={ref} {...props} dispose={null}>
      <mesh geometry={nodes.body.geometry} material={customMaterial} />
      <mesh geometry={nodes.top.geometry} material={customMaterial} />
      <mesh geometry={nodes["customized-top"].geometry} material={customMaterial} />
      <mesh
        geometry={nodes["customized-body"].geometry}
        material={customMaterial}
        position={[0, 0.002, 0]}
        scale={[30, 30, 30]}
      />
    </group>
  )
})

// Add display name for debugging purposes
// Model1_exp.displayName = "Model1"

// Preload the model to improve performance
useGLTF.preload("/src/assets/models/model1.glb")

export default Model1_exp

