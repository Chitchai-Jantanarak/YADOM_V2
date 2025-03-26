import React, { forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { a } from '@react-spring/three';

const Model1 = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('/src/assets/models/model1.glb');
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
          <mesh geometry={nodes.Sphere003.geometry} material={materials['Material.001']} position={[-2.003, -1.191, 2.14]} rotation={[0.043, 0.007, -3.139]} scale={-0.684} />
          <mesh geometry={nodes.Sphere006.geometry} material={materials['Material.001']} position={[-3.376, -0.968, 0.497]} rotation={[-0.012, 0.001, -3.141]} scale={-0.598} />
        </>
      ) : isRightHalf ? (
        // Right half of the model
        <>
          <mesh geometry={nodes.Sphere010.geometry} material={materials['Material.001']} position={[-3.59, -1.084, -1.932]} rotation={[0.075, 0.001, -3.141]} scale={-0.736} />
          <mesh geometry={nodes.Sphere011.geometry} material={materials['Material.001']} position={[-4.462, -0.075, -0.111]} rotation={[-0.135, 0.047, 2.811]} scale={-0.997} />
        </>
      ) : (
        // Regular whole model
        <>
          <mesh geometry={nodes.Sphere003.geometry} material={materials['Material.001']} position={[-2.003, -1.191, 2.14]} rotation={[0.043, 0.007, -3.139]} scale={-0.684} />
          <mesh geometry={nodes.Sphere006.geometry} material={materials['Material.001']} position={[-3.376, -0.968, 0.497]} rotation={[-0.012, 0.001, -3.141]} scale={-0.598} />
          <mesh geometry={nodes.Sphere010.geometry} material={materials['Material.001']} position={[-3.59, -1.084, -1.932]} rotation={[0.075, 0.001, -3.141]} scale={-0.736} />
          <mesh geometry={nodes.Sphere011.geometry} material={materials['Material.001']} position={[-4.462, -0.075, -0.111]} rotation={[-0.135, 0.047, 2.811]} scale={-0.997} />
          <mesh geometry={nodes.Sphere012.geometry} material={materials['Material.001']} position={[-4.462, 0.456, 2.146]} rotation={[-3.086, -0.888, 0.24]} scale={-0.95} />
          <mesh geometry={nodes.Sphere013.geometry} material={materials['Material.001']} position={[-4.462, 1.156, -1.981]} rotation={[0.282, -0.001, 0]} scale={0.688} />
        </>
      )}
    </a.group>
  );
});

useGLTF.preload('/src/assets/models/model1.glb');
export default Model1;
