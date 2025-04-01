"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, AlertCircle, Laptop, X } from "lucide-react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, ContactShadows, Environment } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import { productService } from "../services/productService"
import { transformProduct } from "../utils/dataTransformers"
import { authService } from "../services/authService"
import { addToCart } from "../services/cartService"
import LoginModal from "../components/ui/LoginModal"
import NotificationModal from "../components/ui/NotificationModal"
import TransactionModal from "../components/ui/TransactionModal"
import AromaSelector from "../components/ui/AromaSelector"
import ProductQuantity from "../components/ui/ProductQuantity"
import CartHandler from "../components/ui/CartHandler"
import * as THREE from "three"
import React from "react"
import { useMobile } from "../hooks/useMobile.js"
import { useOrderCheck } from "../hooks/useOrderCheck"

// Debounce function to limit how often a function is called
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// State management with valtio
const state = proxy({
  current: null,
  items: {},
})

// Error boundary for 3D rendering
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

// Floating bubble component
const FloatingBubble = ({ size, position, color, delay = 0 }) => {
  const bubbleRef = useRef(null)

  useEffect(() => {
    if (bubbleRef.current) {
      bubbleRef.current.style.animationDelay = `${delay}s`
    }
  }, [delay])

  return (
    <div
      ref={bubbleRef}
      className="absolute rounded-full animate-float"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position[0]}%`,
        top: `${position[1]}%`,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
        opacity: 0.7,
        filter: "blur(8px)",
        animationDuration: `${Math.random() * 10 + 15}s`,
      }}
    />
  )
}

// Mobile blocking modal component
const MobileBlockingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative border border-white/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <Laptop className="h-16 w-16 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-3">Desktop Only Feature</h2>
          <p className="text-gray-600 mb-6">
            The 3D product configurator is only available on desktop devices. Please visit this page on a computer for
            the full experience.
          </p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

// Fallback model - a colorful cube
function FallbackModel({ scale = 1.5 }) {
  const cubeRef = useRef()

  // Continuous animation
  useFrame((state) => {
    if (cubeRef.current) {
      const t = state.clock.getElapsedTime()
      cubeRef.current.rotation.y = t * 0.2
      cubeRef.current.position.y = Math.sin(t / 2) * 0.05
    }
  })

  // Create a cube with different colored faces
  return (
    <group ref={cubeRef} scale={scale} position={[0, 0, 0]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#FFD700" // Yellow (top)
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-0"
        />
        <meshStandardMaterial
          color="#4682B4" // Steel Blue (side)
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-1"
        />
        <meshStandardMaterial
          color="#D3D3D3" // Light Gray
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-2"
        />
        <meshStandardMaterial
          color="#D3D3D3" // Light Gray
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-3"
        />
        <meshStandardMaterial
          color="#D3D3D3" // Light Gray
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-4"
        />
        <meshStandardMaterial
          color="#D3D3D3" // Light Gray
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={0.5}
          attach="material-5"
        />
      </mesh>
    </group>
  )
}

// 3D Model component with error handling
function ProductModel({ url }) {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { camera } = useThree()
  const [hovered, setHovered] = useState(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const floating = useRef(false)
  const [modelParts, setModelParts] = useState([])

  // Try to load the model with error handling
  const { scene, nodes, materials } = useGLTF(
    url,
    // Success callback
    (gltf) => {
      console.log("Model loaded successfully:", url)
      setModelLoaded(true)
      setLoadError(false)

      // Extract model parts (meshes) and automatically set up state
      const parts = []
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // Create a unique ID for each mesh
          const partId = child.name || `part_${parts.length}`
          parts.push({
            id: partId,
            name: child.name || `Part ${parts.length + 1}`,
            mesh: child,
            originalMaterial: child.material.clone(),
          })

          // Initialize state for this part if not already set
          if (!state.items[partId]) {
            // Get the current color of the mesh
            const color = new THREE.Color()
            if (child.material && child.material.color) {
              color.copy(child.material.color)
            }
            state.items[partId] = "#" + color.getHexString()
          }
        }
      })

      // Set first part as current automatically
      if (parts.length > 0 && !state.current) {
        state.current = parts[0].id
      }

      // Update the global model parts state
      window.setTimeout(() => {
        setModelParts(parts)
      }, 100)
    },
    // Progress callback
    (xhr) => {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`)
    },
    // Error callback
    (error) => {
      console.error("Error loading model:", error)
      setLoadError(true)
    },
  )

  // Apply colors to model parts
  useEffect(() => {
    if (!scene || loadError) return

    // Apply colors to materials based on state
    Object.entries(snap.items).forEach(([partId, color]) => {
      scene.traverse((child) => {
        if (child.isMesh && child.name === partId) {
          if (child.material) {
            child.material.color.set(color)
          }
        }
      })
    })
  }, [scene, snap.items, loadError])

  // Handle hover effect
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
  }, [hovered])

  // Adjust camera on load
  useEffect(() => {
    if (scene && !loadError) {
      // Center and fit the model in view
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2))

      // Set camera position
      camera.position.set(center.x, center.y, center.z + cameraZ * 0.5)
      camera.lookAt(center)
      camera.updateProjectionMatrix()

      // Apply standard material to all meshes
      scene.traverse((child) => {
        if (child.isMesh) {
          // Create a simple standard material with minimal reflections
          if (child.material) {
            const color = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff)
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              roughness: 0.5, // Increased roughness for less complex reflections
              metalness: 0.1, // Reduced metalness for simpler rendering
              envMapIntensity: 0.5, // Reduced for less complex environment mapping
            })
          }
        }
      })
    }
  }, [scene, camera, loadError])

  // Continuous animation for floating effect
  useFrame((state) => {
    floating.current = ref.current
    if (floating.current) {
      const t = state.clock.getElapsedTime()

      // Apply floating motion
      floating.current.position.y = Math.sin(t / 2) * 0.05

      // Apply gentle rotation if not hovered
      if (!hovered) {
        floating.current.rotation.y = t * 0.1
      }
    }
  })

  if (loadError) {
    return <FallbackModel />
  }

  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(e.object.name)
      }}
      onPointerOut={() => setHovered(null)}
      onPointerDown={(e) => {
        e.stopPropagation()
        if (e.object.name) {
          state.current = e.object.name
        }
      }}
    >
      <primitive object={scene} scale={1} position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
    </group>
  )
}

// Main component
const ModelConfigurator = () => {
  const { productType, productid } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [modelUrl, setModelUrl] = useState(null)
  const [canvasError, setCanvasError] = useState(false)
  const [selectedAroma, setSelectedAroma] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [modelParts, setModelParts] = useState([])
  const snap = useSnapshot(state)
  const [productBones, setProductBones] = useState([])
  // Add these state variables inside the ModelConfigurator component after other useState declarations
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const { hasPendingOrder, pendingOrderId, isChecking } = useOrderCheck()

  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationConfig, setNotificationConfig] = useState({
    title: "",
    message: "",
    type: "success",
    actionButton: null,
  })

  // Mobile detection
  const isMobile = useMobile()
  const [showMobileModal, setShowMobileModal] = useState(false)

  // Check if mobile on mount
  useEffect(() => {
    if (isMobile) {
      setShowMobileModal(true)
    }
  }, [isMobile])

  // Handle color change with debounce
  const [debouncedColor, setDebouncedColor] = useState(null)

  // Immediate color preview without affecting the 3D model
  const handleColorPreview = (color) => {
    setDebouncedColor(color)
  }

  // Debounced function that actually updates the 3D model
  const handleColorChange = debounce((color) => {
    if (state.current) {
      state.items[state.current] = color
    }
  }, 100) // 100ms delay

  // Effect to apply the debounced color
  useEffect(() => {
    if (debouncedColor && state.current) {
      handleColorChange(debouncedColor)
    }
  }, [debouncedColor])

  // Make setModelParts globally available for the ProductModel component
  useEffect(() => {
    window.setModelParts = setModelParts
  }, [])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(productid)
        const transformedProduct = transformProduct(data)

        if (transformedProduct.type !== "MAIN_PRODUCT" && productType === "MAIN_PRODUCT") {
          // Redirect to regular product view if not a MAIN_PRODUCT
          navigate(`/product-view/${productid}`)
          return
        }

        setProduct(transformedProduct)

        // Set the model URL - always use the consistent path structure
        setModelUrl(`/src/assets/models/model${productid}.glb`)

        // Calculate initial price
        setTotalPrice(transformedProduct.price)

        // Extract bones from the product data
        if (data.bones && data.bones.length > 0) {
          setProductBones(data.bones)
          console.log("Product bones:", data.bones)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productid, productType, navigate])

  // Update model parts when state.items changes
  useEffect(() => {
    const parts = Object.keys(state.items).map((id) => ({
      id,
      name: id.replace(/_/g, " ").replace(/\d+$/, "").trim() || `Part ${id}`,
      color: state.items[id],
    }))
    setModelParts(parts)
  }, [snap.items])

  // Handle aroma selection
  const handleAromaSelect = (aroma) => {
    setSelectedAroma(aroma)
    updateTotalPrice(quantity, aroma)
  }

  // Update total price based on product, quantity, and aroma
  const updateTotalPrice = (qty, aroma) => {
    if (!product) return

    let price = product.price
    if (aroma) {
      price += aroma.price
    }

    setTotalPrice(price * qty)
  }

  // Handle part selection
  const handlePartSelect = (partId) => {
    state.current = partId
  }

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      await authService.login(email, password)
      setShowLoginModal(false)

      // After successful login, proceed with adding to cart
      handleAddToCart()
    } catch (err) {
      console.error("Login failed:", err)
      throw err
    }
  }

  // Update the handleAddToCart function to map mesh names to bone IDs
  const handleAddToCart = async (cartData) => {
    if (!product) return

    try {
      setAddingToCart(true)

      // Check if user has pending orders
      if (hasPendingOrder) {
        setShowTransactionModal(true)
        setAddingToCart(false)
        return
      }

      // Check if aroma is selected
      if (!cartData.aromaId) {
        setNotificationConfig({
          title: "Aroma Required",
          message: "Please select an aroma before adding to cart.",
          type: "error",
        })
        setShowNotificationModal(true)
        setAddingToCart(false)
        return
      }

      // Map mesh names to actual bone IDs
      const mappedModifiedBones = cartData.modifiedBones.map((bone) => {
        // Convert boneId to string for comparison if it's not already a string
        const meshName = typeof bone.boneId === "string" ? bone.boneId : String(bone.boneId)

        // Try to find a matching bone by name
        const matchingBone = productBones.find(
          (productBone) => productBone.name && productBone.name.toLowerCase() === meshName.toLowerCase(),
        )

        if (matchingBone) {
          return {
            ...bone,
            boneId: matchingBone.id, // Use the actual bone ID from the database
          }
        }

        // If no match is found, log a warning and use the first bone as fallback
        console.warn(`No matching bone found for mesh: ${meshName}`)
        return productBones.length > 0 ? { ...bone, boneId: productBones[0].id } : bone
      })

      // Update the cart data with the mapped bones
      const updatedCartData = {
        ...cartData,
        modifiedBones: mappedModifiedBones,
      }

      // Add the cart item using the cartService
      await addToCart(updatedCartData)

      // Show success message
      setNotificationConfig({
        title: "Added to Cart",
        message: "Your customized product has been added to your cart successfully!",
        type: "success",
        actionButton: (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowNotificationModal(false)
                navigate("/starter")
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white hover:opacity-90 transition-all shadow-md"
            >
              Go to Home
            </button>
            <button
              onClick={() => {
                setShowNotificationModal(false)
                navigate("/cart")
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:opacity-90 transition-all shadow-md"
            >
              View Cart
            </button>
          </div>
        ),
      })
      setShowNotificationModal(true)
      setAddingToCart(false)
    } catch (err) {
      console.error("Error adding to cart:", err)
      setAddingToCart(false)

      // Check if it's a user ID error
      if (err.message && err.message.includes("User ID")) {
        setNotificationConfig({
          title: "Authentication Required",
          message: "User ID is required. Please log in again.",
          type: "error",
          actionButton: (
            <button
              onClick={() => {
                setShowNotificationModal(false)
                setShowLoginModal(true)
              }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:opacity-90 transition-all shadow-md"
            >
              Log In
            </button>
          ),
        })
      } else {
        setNotificationConfig({
          title: "Error",
          message: "Failed to add product to cart. Please try again.",
          type: "error",
        })
      }
      setShowNotificationModal(true)
    }
  }

  // Handle mobile modal close
  const handleMobileModalClose = () => {
    setShowMobileModal(false)
    navigate(-1) // Go back when closed
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="text-center max-w-md p-8 bg-white/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist or is no longer available."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* Dreamy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200 z-0">
        {/* Large circular elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-pink-300/40 to-purple-300/40 blur-3xl"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-blue-300/40 to-purple-300/40 blur-3xl"></div>
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-pink-200/30 to-blue-200/30 blur-3xl"></div>

        {/* Smaller circular highlights */}
        <div className="absolute top-[15%] right-[25%] w-[15%] h-[15%] rounded-full bg-white/20 blur-2xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[10%] h-[10%] rounded-full bg-white/20 blur-2xl"></div>
      </div>

      {/* Main content container with glassmorphism effect */}
      <div className="absolute inset-4 rounded-[32px] overflow-hidden border border-white/40 backdrop-blur-xl bg-white/15 shadow-xl z-10">
        {/* Header with back button */}
        <div className="absolute top-4 left-4 z-30 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black glass-button px-4 py-2 rounded-full"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-[60%] h-[70%] rounded-2xl overflow-hidden">
            {canvasError ? (
              <div className="w-full h-full flex items-center justify-center bg-white/60 backdrop-blur-md">
                <div className="text-center p-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-gray-700 font-medium">3D Rendering Error</p>
                  <p className="text-gray-500 mt-2">There was a problem rendering the 3D model.</p>
                </div>
              </div>
            ) : (
              <ErrorBoundary
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-white/60 backdrop-blur-md">
                    <div className="text-center p-8">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                      <p className="text-gray-700 font-medium">3D Model Error</p>
                      <p className="text-gray-500 mt-2">Using fallback display</p>
                    </div>
                  </div>
                }
              >
                <Canvas
                  shadows
                  camera={{ position: [0, 0, 4], fov: 50 }}
                  onError={(e) => {
                    console.error("Canvas error:", e)
                    setCanvasError(true)
                  }}
                >
                  <ambientLight intensity={0.6} />
                  <spotLight intensity={0.4} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />

                  <Suspense fallback={<FallbackModel />}>
                    <ProductModel url={modelUrl} />
                    <Environment preset="dawn" background={false} resolution={128} />
                    <ContactShadows
                      position={[0, -0.8, 0]}
                      opacity={0.2}
                      scale={8}
                      blur={1.5}
                      far={0.8}
                      resolution={256}
                    />
                    <OrbitControls
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI - Math.PI / 6}
                      enableZoom={true}
                      enablePan={false}
                    />
                  </Suspense>
                </Canvas>
              </ErrorBoundary>
            )}
          </div>
        </div>

        {/* Left sidebar - Customization controls */}
        <div className="absolute top-20 left-6 w-[230px] z-20 space-y-4">
          {/* Customization panel */}
          <div className="glass-panel p-5 rounded-[24px] backdrop-blur-xl border border-white/40 shadow-lg">
            <h2 className="text-[#0c9df8] text-lg font-medium mb-1">Customize</h2>
            <p className="text-gray-700 text-sm mb-4">Choose the colors for different parts of your product</p>

            {/* Part selection */}
            <div className="mb-4">
              <h3 className="text-sm text-gray-600 mb-2">Select a part to customize</h3>
              <div className="space-y-2">
                {modelParts.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handlePartSelect(part.id)}
                    className="w-full flex items-center justify-between p-2 text-sm text-gray-700"
                  >
                    <span>{part.name}</span>
                    <div
                      className={`w-4 h-4 rounded-full ${snap.current === part.id ? "bg-red-500" : "bg-gray-200"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            {snap.current && (
              <div>
                <h3 className="text-sm text-gray-600 mb-2">Color for Part</h3>
                <HexColorPicker
                  color={debouncedColor || snap.items[snap.current]}
                  onChange={handleColorPreview}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Product details and Aroma selection */}
        <div className="absolute top-20 right-6 w-[230px] z-20 flex flex-col gap-4">
          {/* Product details panel */}
          <ProductQuantity
            product={product}
            quantity={quantity}
            setQuantity={setQuantity}
            totalPrice={totalPrice}
            updateTotalPrice={updateTotalPrice}
            selectedAroma={selectedAroma}
          />

          {/* Aroma selection panel */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            <AromaSelector onAromaSelect={handleAromaSelect} selectedAroma={selectedAroma} />
          </div>

          {/* Add to cart button - separate from product details */}
          <CartHandler
            product={product}
            quantity={quantity}
            selectedAroma={selectedAroma}
            totalPrice={totalPrice}
            boneConfigurations={snap.items}
            productBones={productBones} // Pass the product bones
            onAddToCart={handleAddToCart}
            isAddingToCart={addingToCart}
            onShowLoginModal={() => setShowLoginModal(true)}
          />
        </div>
      </div>

      {/* Mobile Blocking Modal */}
      <MobileBlockingModal isOpen={showMobileModal} onClose={handleMobileModalClose} />

      {/* Add the TransactionModal component at the end of the return statement, just before the closing </div> */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        orderId={pendingOrderId}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        redirectPath="/starter"
        message="Please login to add items to your cart. You need to be logged in to save your customizations and complete your purchase."
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationConfig.title}
        message={notificationConfig.message}
        type={notificationConfig.type}
        actionButton={notificationConfig.actionButton}
      />
    </div>
  )
}

export default ModelConfigurator

