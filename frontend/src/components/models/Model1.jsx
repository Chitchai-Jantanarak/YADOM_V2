import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { a } from '@react-spring/three';

const Model1 = forwardRef((props, ref) => {
  const { nodes } = useGLTF('/src/assets/models/model1.glb');
  const { color = "#FFFFFF", opacity = 1, scale = 1, isLeftHalf = false, isRightHalf = false, ...otherProps } = props;

  // Using a.group so that the animated props are applied automatically
  return (
    <a.group
      ref={ref}
      {...otherProps}
      dispose={null}
      rotation={[0, 0, 0]}
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
    >
      {/* If this is a half model (left or right), create a geometry that looks like half */}
      {isLeftHalf ? (
        // Left half of the model
        <>
          <mesh position={[-0.25, 0, 0]}>
            <boxGeometry args={[0.5, 1, 1]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
          <mesh position={[-0.25, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16, 0, Math.PI]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
        </>
      ) : isRightHalf ? (
        // Right half of the model
        <>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.5, 1, 1]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
          <mesh position={[0.25, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16, Math.PI, Math.PI]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
        </>
      ) : (
        // Regular whole model
        <>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={color} transparent={true} opacity={opacity} />
          </mesh>
        </>
      )}
    </a.group>
  );
});

useGLTF.preload('/src/assets/models/model1.glb');
export default Model1;