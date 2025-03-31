"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { AlertCircle, ZoomIn, ZoomOut } from "lucide-react"
import { a, useSpring } from "@react-spring/three"
import * as THREE from "three"
import React from "react"

// Add this at the top of the file, after the imports
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Three.js error caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

// Fallback model - a colorful cube
function FallbackModel({ onClick, scale = 1 }) {
  const cubeRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Set up spring animations with the provided scale
  const [springs, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    scale: scale, // Use the provided scale instead of hardcoded value
    config: { mass: 1, tension: 180, friction: 12 },
  }))

  // Update scale when the prop changes
  useEffect(() => {
    console.log("FallbackModel scale updated:", scale)
    api.start({ scale: scale })
  }, [scale, api])

  // Continuous animation
  useFrame((state) => {
    if (cubeRef.current) {
      const t = state.clock.getElapsedTime()
      cubeRef.current.rotation.y = t * 0.2
      cubeRef.current.position.y = Math.sin(t / 2) * 0.05
    }
  })

  // Handle pointer events
  const handlePointerOver = () => {
    setHovered(true)
    document.body.style.cursor = "pointer"
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = "auto"
  }

  // Handle click for wobble effect - scales DOWN
  const handleClick = (e) => {
    e.stopPropagation()

    api.start({
      scale: scale * 0.9, // Scale down relative to current scale
      rotation: [Math.random() * 1 - 0.15, Math.random() * 1 - 0.15, Math.random() * 1 - 0.15],
      config: { tension: 300, friction: 10 },
    })

    setTimeout(() => {
      api.start({
        rotation: [0, 0, 0],
        scale: scale, // Back to current scale
        config: { tension: 150, friction: 15 },
      })
    }, 350)

    if (onClick) onClick(e)
  }

  // Create a cube with different colored faces
  return (
    <a.group
      ref={cubeRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={springs.scale}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#5B8FB9" // Darker blue
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-0"
        />
        <meshStandardMaterial
          color="#7B66FF" // Darker purple
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-1"
        />
        <meshStandardMaterial
          color="#FFB100" // Gold/amber
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-2"
        />
        <meshStandardMaterial
          color="#FF6D60" // Coral/salmon
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-3"
        />
        <meshStandardMaterial
          color="#98D8AA" // Mint green
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-4"
        />
        <meshStandardMaterial
          color="#F8F4EA" // Off-white
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-5"
        />
      </mesh>
    </a.group>
  )
}

// Actual model component - directly loads and displays the model
function ActualModel({ url, scale, onClick }) {
  const modelRef = useRef()
  const { camera } = useThree()
  const [hovered, setHovered] = useState(false)

  console.log("ActualModel rendering with scale:", scale, "and url:", url)

  // Load the model
  const { scene } = useGLTF(url)

  // Create a mutable ref for the current scale to use in animations
  const currentScale = useRef(scale)

  // Update the ref when scale prop changes
  useEffect(() => {
    currentScale.current = scale
    console.log("ActualModel scale updated to:", scale)
  }, [scale])

  // Apply scale directly to the model
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale)
      console.log("Applied scale directly to model:", scale)
    }
  }, [scale])

  // Continuous animation for floating effect
  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime()

      // Apply floating motion
      modelRef.current.position.y = Math.sin(t / 2) * 0.05

      // Apply gentle rotation if not hovered
      if (!hovered) {
        modelRef.current.rotation.y = t * 0.1
      }

      // Ensure scale is always correct
      if (modelRef.current.scale.x !== currentScale.current) {
        modelRef.current.scale.set(currentScale.current, currentScale.current, currentScale.current)
      }
    }
  })

  // Handle pointer events
  const handlePointerOver = () => {
    setHovered(true)
    document.body.style.cursor = "pointer"
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = "auto"
  }

  // Handle click for wobble effect
  const handleClick = (e) => {
    e.stopPropagation()

    // Create a smoother animation using spring physics
    const wobbleAnimation = () => {
      const startTime = Date.now()
      const duration = 350 // milliseconds
      const originalScale = currentScale.current
      const originalRotation = {
        x: modelRef.current.rotation.x,
        y: modelRef.current.rotation.y,
        z: modelRef.current.rotation.z,
      }

      // Small random rotation offsets
      const rotationOffsetX = Math.random() * 0.1 - 0.05
      const rotationOffsetZ = Math.random() * 0.1 - 0.05

      // Animation frame
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing functions for smoother animation
        const easeOut = (t) => 1 - Math.pow(1 - t, 2)
        const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

        if (modelRef.current) {
          if (progress < 1) {
            // Scale down phase (first half)
            if (progress < 0.5) {
              const scaleProgress = easeOut(progress * 2)
              const targetScale = originalScale * (1 - 0.1 * scaleProgress) // Scale down to 90%
              modelRef.current.scale.set(targetScale, targetScale, targetScale)

              // Apply rotation offset
              modelRef.current.rotation.x = originalRotation.x + rotationOffsetX * scaleProgress
              modelRef.current.rotation.z = originalRotation.z + rotationOffsetZ * scaleProgress
            }
            // Scale up phase (second half)
            else {
              const scaleProgress = easeInOut((progress - 0.5) * 2)
              const targetScale = originalScale * (0.9 + 0.1 * scaleProgress) // Scale back up to 100%
              modelRef.current.scale.set(targetScale, targetScale, targetScale)

              // Revert rotation offset
              modelRef.current.rotation.x = originalRotation.x + rotationOffsetX * (1 - scaleProgress)
              modelRef.current.rotation.z = originalRotation.z + rotationOffsetZ * (1 - scaleProgress)
            }

            requestAnimationFrame(animate)
          } else {
            // Ensure we end at exactly the original values
            modelRef.current.scale.set(originalScale, originalScale, originalScale)
            modelRef.current.rotation.x = originalRotation.x
            modelRef.current.rotation.z = originalRotation.z
          }
        }
      }

      // Start animation
      requestAnimationFrame(animate)
    }

    // Start the wobble animation
    if (modelRef.current) {
      wobbleAnimation()
    }

    if (onClick) onClick(e)
  }

  // Adjust camera on load
  useEffect(() => {
    if (scene) {
      camera.position.set(0, 0, 4)
      camera.updateProjectionMatrix()

      // Apply standard material to all meshes
      scene.traverse((child) => {
        if (child.isMesh) {
          // Create a simple standard material with minimal reflections
          if (child.material) {
            child.material = new THREE.MeshStandardMaterial({
              color: child.material.color || 0xffffff,
              roughness: 0.7,
              metalness: 0.1,
              envMapIntensity: 0.5,
            })
          }
        }
      })
    }
  }, [scene, camera])

  return (
    <group
      ref={modelRef}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  )
}

// This component checks if the model exists before attempting to render it
function ModelWithFallback({ url, scale, onClick }) {
  const [modelExists, setModelExists] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  console.log("ModelWithFallback rendering with scale:", scale)

  // Check if the model exists
  useEffect(() => {
    let isMounted = true

    const checkModel = async () => {
      try {
        console.log("Checking if model exists at:", url)
        const response = await fetch(url, { method: "HEAD" })

        if (isMounted) {
          const exists = response.ok
          console.log("Model exists:", exists)
          setModelExists(exists)
          setIsChecking(false)
        }
      } catch (error) {
        console.error("Error checking model:", error)
        if (isMounted) {
          setModelExists(false)
          setIsChecking(false)
        }
      }
    }

    checkModel()

    return () => {
      isMounted = false
    }
  }, [url])

  // While checking, show the fallback
  if (isChecking) {
    return <FallbackModel onClick={onClick} scale={scale} />
  }

  // If model exists, render it with error handling
  if (modelExists) {
    return (
      <ErrorBoundary fallback={<FallbackModel onClick={onClick} scale={scale} />}>
        <Suspense fallback={<FallbackModel onClick={onClick} scale={scale} />}>
          <ActualModel url={url} scale={scale} onClick={onClick} />
        </Suspense>
      </ErrorBoundary>
    )
  }

  // If model doesn't exist, show fallback
  return <FallbackModel onClick={onClick} scale={scale} />
}

export default function ModelViewer({
  modelUrl,
  productId,
  onModelLoad = null,
  onModelError = null,
  onModelFetch = null,
}) {
  const [modelError, setModelError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [modelScale, setModelScale] = useState(1) // Default scale
  const [canvasError, setCanvasError] = useState(false)

  console.log("ModelViewer rendering with scale:", modelScale, "and url:", modelUrl)

  // Check if the model URL is valid
  useEffect(() => {
    let isMounted = true

    const checkModelUrl = async () => {
      if (!isMounted) return

      setIsLoading(true)
      setModelError(false)

      if (!modelUrl) {
        if (!isMounted) return
        setModelError(true)
        setErrorMessage("No model URL provided")
        setIsLoading(false)
        return
      }

      if (onModelFetch) onModelFetch(modelUrl)
      setIsLoading(false)
    }

    checkModelUrl()

    return () => {
      isMounted = false
    }
  }, [modelUrl, onModelFetch])

  // Handle model click
  const handleModelClick = () => {
    console.log("Model clicked!")
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setModelScale((prev) => {
      const newScale = prev + 0.05
      console.log("Zooming in to scale:", newScale)
      return newScale
    })
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setModelScale((prev) => {
      const newScale = Math.max(prev - 0.05, 0.1)
      console.log("Zooming out to scale:", newScale)
      return newScale
    })
  }

  // If we have an error with the Canvas, show a fallback UI
  if (canvasError) {
    return (
      <div className="w-full">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">3D Rendering Error</p>
              <p>There was a problem rendering the 3D model. Please try again later.</p>
            </div>
          </div>
        </div>
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-500 mx-auto mb-4 rounded"></div>
            <p className="text-gray-500">3D model preview unavailable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {modelError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Model Loading Error</p>
            <p className="text-sm">Could not load the 3D model. Using fallback display.</p>
            <p className="text-xs mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="w-full h-64 bg-gradient-to-b from-blue-200 to-purple-200 rounded-lg overflow-hidden cursor-pointer">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ErrorBoundary
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-red-500 mx-auto mb-4 rounded"></div>
                  <p className="text-gray-500">3D rendering error</p>
                </div>
              </div>
            }
          >
            <Canvas
              dpr={[1, 2]}
              camera={{ position: [0, 0, 4], fov: 45 }}
              onError={(e) => {
                console.error("Canvas error:", e)
                setCanvasError(true)
              }}
            >
              {/* Simple lighting without shadows */}
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 5, 5]} intensity={0.5} />

              {/* Render the model with fallback */}
              <ModelWithFallback url={modelUrl} scale={modelScale} onClick={handleModelClick} />

              <Environment preset="sunset" background={false} />
              <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={7} />
            </Canvas>
          </ErrorBoundary>
        )}
      </div>

      <div className="flex justify-center items-center mt-2">
        <div className="flex gap-2 items-center">
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={16} className="mr-1" />
            <span>-</span>
          </button>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded min-w-[40px] text-center">
            {modelScale.toFixed(2)}
          </span>
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={16} className="mr-1" />
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

