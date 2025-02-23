import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Matrix4, Vector3 } from 'three';

const StarField = ({ count = 1500, mousePosition }) => {
  const mesh = useRef();
  const matrix = useMemo(() => new Matrix4(), []);

  // Generate
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      const orbitType = Math.floor(Math.random() * 3);
      const orbitSpeed = Math.random() * 0.2 + 0.1;
      const orbitRadius = Math.random() * 2 + 1;
      const orbitPhase = Math.random() * Math.PI * 2;
      const orbitCenter = new Vector3(x, y, z);

      temp.push({
        position: new Vector3(x, y, z),
        orbitType,
        orbitSpeed,
        orbitRadius,
        orbitPhase,
        orbitCenter: orbitCenter.clone(),
        time: Math.random() * 1000
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    particles.forEach((particle, i) => {
      particle.time += delta;
      let newPosition = particle.position.clone();

      switch (particle.orbitType) {
        case 0:
          newPosition.x = particle.orbitCenter.x + Math.cos(particle.time * particle.orbitSpeed + particle.orbitPhase) * particle.orbitRadius;
          newPosition.y = particle.orbitCenter.y + Math.sin(particle.time * particle.orbitSpeed + particle.orbitPhase) * particle.orbitRadius;
          break;
        case 1:
          newPosition.x = particle.orbitCenter.x + Math.cos(particle.time * particle.orbitSpeed + particle.orbitPhase) * particle.orbitRadius;
          newPosition.y = particle.orbitCenter.y + Math.sin(particle.time * particle.orbitSpeed + particle.orbitPhase) * particle.orbitRadius * 0.5;
          break;
        case 2:
          const t = particle.time * particle.orbitSpeed;
          const scale = particle.orbitRadius * 0.5;
          newPosition.x = particle.orbitCenter.x + scale * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
          newPosition.y = particle.orbitCenter.y + scale * Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
          break;
      }

      const dx = mousePosition.x - newPosition.x;
      const dy = mousePosition.y - newPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const minDistance = 5;
      const maxDistance = 50;

      if (distance < maxDistance) {
        const springFactor = Math.max(0, (maxDistance - distance) / (maxDistance - minDistance));
        newPosition.x += dx * springFactor * 0.1;
        newPosition.y += dy * springFactor * 0.1;
      }

      particle.position.copy(newPosition);

      matrix.makeTranslation(
        particle.position.x,
        particle.position.y,
        particle.position.z
      );
      mesh.current.setMatrixAt(i, matrix);
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8}
      />
    </instancedMesh>
  );
};

const GradientBG = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const lastCursorPosition = useRef({ x: 0, y: 0 });
  const lastTimestamp = useRef(performance.now());

  const handleMouseMove = React.useCallback((event) => {
    const currentCursorPosition = { x: event.clientX, y: event.clientY };
    const currentTime = performance.now();

    const dx = currentCursorPosition.x - lastCursorPosition.current.x;
    const dy = currentCursorPosition.y - lastCursorPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeElapsed = currentTime - lastTimestamp.current;
    const speed = distance / timeElapsed;

    lastCursorPosition.current = currentCursorPosition;
    lastTimestamp.current = currentTime;

    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x: x * 8, y: y * 5 });
  }, []);

  return (
    <div 
      className="fixed inset-0" 
      onMouseMove={handleMouseMove} 
      style={{
        background: 'radial-gradient(circle at center, rgba(24, 118, 110, 1), rgba(0, 0, 0, 1))',
        position: 'relative',
        height: '100vh'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 90, aspect: window.innerWidth / window.innerHeight }}
        style={{ background: 'transparent', position: 'absolute', top: 0, left: 0 }}
      >
        <StarField mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
};

export default GradientBG;
