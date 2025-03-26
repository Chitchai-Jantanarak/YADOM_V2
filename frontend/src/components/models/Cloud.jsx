import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// The Cloud component with forwardRef to allow parent components to access and manipulate it
export const Cloud = forwardRef(({ color = "#1e88e5", opacity = 1, ...props }, ref) => {
  const groupRef = useRef();
  const { nodes, materials } = useGLTF('/src/assets/models/cloud.glb');
  
  // Create a clone of the material to avoid modifying the original
  const materialRef = useRef(new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: opacity
  }));
  
  // Update material when props change
  React.useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
      materialRef.current.opacity = opacity;
    }
  }, [color, opacity]);

  // Expose the group ref to parent components
  useImperativeHandle(ref, () => groupRef.current);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        geometry={nodes.Cloud.geometry}
        material={materialRef.current}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={1}
      />
    </group>
  );
});

// Preload the model to improve performance
useGLTF.preload('/src/assets/models/cloud.glb');
