"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ShoppingCart, ArrowLeft, Palette } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, ContactShadows, Environment } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import { productService } from "../../services/productService"
import { transformProduct } from "../../utils/dataTransformers"
import { isAuthenticated, authService } from "../../services/authService"
import LoginModal from "../../components/ui/LoginModal"

// State management with valtio
const state = proxy({
  current: null,
  items: {},
})

const ModelConfigurator = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [configurableBones, setConfigurableBones] = useState([])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const data = await productService.getProductById(id)
        const transformedProduct = transformProduct(data)

        if (transformedProduct.type !== "MAIN_PRODUCT") {
          // Redirect to regular product view if not a MAIN_PRODUCT
          navigate(`/product/${id}`)
          return
        }

        setProduct(transformedProduct)

        // Initialize state.items with bone colors
        if (transformedProduct.bones) {
          const configBones = transformedProduct.bones.filter((bone) => bone.isConfiguration)
          setConfigurableBones(configBones)

          // Initialize color state for each bone
          const colorState = {}
          configBones.forEach((bone) => {
            colorState[bone.id] = bone.defDetail || "#ffffff"
          })
          state.items = colorState
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id, navigate])

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

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return

    // Check if user is authenticated
    if (!isAuthenticated()) {
      setShowLoginModal(true)
      return
    }

    try {
      setAddingToCart(true)

      // Prepare cart item data with bone configurations
      const cartItem = {
        productId: product.id,
        quantity,
        price: product.price * quantity,
        boneConfigurations: { ...state.items },
      }

      // TODO: Implement actual cart service call
      console.log("Adding to cart:", cartItem)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Show success message
      alert("Product added to cart!")
      setAddingToCart(false)

      // Navigate to starter page
      navigate("/starter")
    } catch (err) {
      console.error("Error adding to cart:", err)
      setAddingToCart(false)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist or is no longer available."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 relative overflow-hidden">
      {/* Back button - positioned at top left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Product title */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-white px-6 py-2 rounded-full shadow-md">
        <h1 className="text-lg font-bold">{product.name}</h1>
      </div>

      {/* Main 3D canvas */}
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />

          <Suspense fallback={null}>
            <ProductModel url={`/src/assets/models/shop/${product.id}.glb`} bones={configurableBones} />
            <Environment preset="city" />
            <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />
            <OrbitControls
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
              enableZoom={true}
              enablePan={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Color picker */}
      <ColorPicker />

      {/* Add to cart button - positioned at bottom right */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="absolute bottom-6 right-6 z-10 flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 shadow-lg"
      >
        {addingToCart ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </span>
        ) : (
          <span className="flex items-center">
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </span>
        )}
      </button>

      {/* Bone selector - positioned at bottom left */}
      <div className="absolute bottom-6 left-6 z-10 bg-white p-4 rounded-lg shadow-lg max-w-xs">
        <div className="flex items-center mb-2">
          <Palette size={16} className="mr-2" />
          <h3 className="text-sm font-medium">Select a part to customize</h3>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {configurableBones.map((bone) => (
            <button
              key={bone.id}
              onClick={() => (state.current = bone.id)}
              className={`w-full flex items-center justify-between p-2 rounded-md text-sm ${
                state.current === bone.id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <span>{bone.name}</span>
              <div
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: state.items[bone.id] || "#ffffff" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        redirectPath="/starter"
      />
    </div>
  )
}

// 3D Model component
function ProductModel({ url, bones }) {
  const ref = useRef()
  const snap = useSnapshot(state)
  const { scene, nodes, materials } = useGLTF(url)
  const [hovered, setHovered] = useState(null)

  // Apply bone colors to model
  useEffect(() => {
    if (!scene) return

    // Apply colors to materials based on state
    Object.entries(snap.items).forEach(([boneId, color]) => {
      // Find the mesh corresponding to this bone
      scene.traverse((child) => {
        if (child.isMesh && child.name.includes(boneId)) {
          if (child.material) {
            child.material.color.set(color)
          }
        }
      })
    })
  }, [scene, snap.items])

  // Handle hover effect
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto"
  }, [hovered])

  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation()
        // Check if the mesh corresponds to a configurable bone
        const boneId = bones.find((bone) => e.object.name.includes(bone.id))?.id
        if (boneId) setHovered(boneId)
      }}
      onPointerOut={() => setHovered(null)}
      onPointerDown={(e) => {
        e.stopPropagation()
        // Check if the mesh corresponds to a configurable bone
        const boneId = bones.find((bone) => e.object.name.includes(bone.id))?.id
        if (boneId) state.current = boneId
      }}
    >
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} rotation={[0, Math.PI / 4, 0]} />
    </group>
  )
}

// Color picker component
function ColorPicker() {
  const snap = useSnapshot(state)

  if (!snap.current) return null

  return (
    <div className="absolute right-6 top-20 z-10 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium mb-2">Customize: {snap.current}</h3>
      <HexColorPicker color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <div className="mt-2 text-xs text-gray-500">Click on different parts of the model to customize</div>
    </div>
  )
}

export default ModelConfigurator

