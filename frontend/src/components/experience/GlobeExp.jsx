import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { useInView } from "react-intersection-observer"

function EarthModel({ inView }) {
  const earthRef = useRef()
  const { scene } = useGLTF("/src/assets/models/globe.glb")

  useFrame(() => {
    if (inView && earthRef.current) {
      earthRef.current.rotation.y += 0.005
    }
  })

  return <primitive ref={earthRef} object={scene} scale={2.5} position={[0, 0, 0]} />
}

// Main Earth3D component with canvas setup
export default function GlobeExp() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  })

  return (
    <div ref={ref} className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 90 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <EarthModel inView={inView} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} rotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}

