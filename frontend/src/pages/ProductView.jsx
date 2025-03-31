"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ShoppingCart, Minus, Plus, ArrowLeft, Check } from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, ContactShadows, Environment } from "@react-three/drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useSnapshot } from "valtio"
import { productService } from "../services/productService"
import { transformProduct } from "../utils/dataTransformers"
import { handleImageError } from "../utils/imageUtils"
import { isAuthenticated, authService } from "../services/authService"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import PageTransition from "../components/layout/PageTransition"
import LoginModal from "../components/ui/LoginModal"

// State management with valtio for 3D model customization
const state = proxy({
  current: null,
  items: {},
})

const ProductView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedBones, setSelectedBones] = useState({})
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
        setProduct(transformedProduct)

        // Set default selected color if available
        if (
          transformedProduct.type === "ACCESSORY" &&
          transformedProduct.colors &&
          transformedProduct.colors.length > 0
        ) {
          setSelectedColor(transformedProduct.colors[0])
        }

        // Initialize selected bones for MAIN_PRODUCT
        if (transformedProduct.type === "MAIN_PRODUCT" && transformedProduct.bones) {
          // Get configurable bones
          const configBones = transformedProduct.bones.filter((bone) => bone.isConfiguration)
          setConfigurableBones(configBones)

          // Initialize bone colors for state management
          const initialBones = {}
          const colorState = {}

          configBones.forEach((bone) => {
            initialBones[bone.name] = bone.defDetail || "#ffffff"
            colorState[bone.id] = bone.defDetail || "#ffffff"
          })

          setSelectedBones(initialBones)
          state.items = colorState

          // Set first configurable bone as active if available
          if (configBones.length > 0) {
            state.current = configBones[0].id
          }
        }

        // Fetch related products
        fetchRelatedProducts(transformedProduct.type)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product. Please try again.")
        setLoading(false)
      }
    }

    fetchProductData()
  }, [id])

  // Fetch related products
  const fetchRelatedProducts = async (productType) => {
    try {
      const data = await productService.getAvailableProducts({
        limit: 5,
        type: productType,
      })

      // Filter out the current product
      const filtered = data.products.filter((p) => p.id !== Number.parseInt(id))
      setRelatedProducts(filtered.map(transformProduct))
    } catch (err) {
      console.error("Error fetching related products:", err)
    }
  }

  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value))
    setQuantity(newQuantity)
  }

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color)
  }

  // Handle bone configuration change
  const handleBoneChange = (boneName, value) => {
    setSelectedBones((prev) => ({
      ...prev,
      [boneName]: value,
    }))
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

      // Prepare cart item data
      const cartItem = {
        productId: product.id,
        quantity,
        price: product.price * quantity,
      }

      // Add color selection for accessories
      if (product.type === "ACCESSORY" && selectedColor) {
        cartItem.selectedColor = selectedColor
      }

      // Add bone configurations for main products
      if (product.type === "MAIN_PRODUCT") {
        if (Object.keys(state.items).length > 0) {
          // Use the state.items for 3D configurator
          cartItem.boneConfigurations = { ...state.items }
        } else if (Object.keys(selectedBones).length > 0) {
          // Use selectedBones for regular view
          cartItem.boneConfigurations = selectedBones
        }
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
      <div className="min-h-screen bg-white">
        <NavBar2 />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar2 />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The product you're looking for doesn't exist or is no longer available."}
            </p>
            <Link to="/shop" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Determine if this is a MAIN_PRODUCT that should use the configurator
  const isMainProduct = product.type === "MAIN_PRODUCT"
  const hasConfigurableBones = configurableBones.length > 0

  // If it's a MAIN_PRODUCT with configurable bones, render the configurator
  if (isMainProduct && hasConfigurableBones) {
    return <ProductConfigurator product={product} configurableBones={configurableBones} />
  }

  // Otherwise, render the regular product view
  const isAccessory = product.type === "ACCESSORY"

  return (
    <div className="min-h-screen bg-white">
      <NavBar2 />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back</span>
          </button>
        </div>

        {/* Product detail section */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left column - Product image or 3D model */}
          <div className="w-full md:w-1/2">
            {isAccessory ? (
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <img
                  src={`/src/assets/images/shop/${product.id}.png`}
                  alt={product.name}
                  className="max-h-[400px] w-auto object-contain"
                  onError={(e) => handleImageError(e, "product", product.name)}
                />
              </div>
            ) : (
              <div className="bg-gradient-to-b from-blue-100 to-purple-100 rounded-lg p-4 h-[400px]">
                <ModelViewer modelUrl={`/src/assets/models/shop/${product.id}.glb`} productId={id} />
              </div>
            )}
          </div>

          {/* Right column - Product details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold uppercase mb-2">{product.name}</h1>
            <p className="text-2xl font-bold mb-6">{product.price?.toFixed(2)} B</p>

            {/* Color selection for accessories */}
            {isAccessory && product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm mb-2">Color:</p>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-black" : "border-gray-200"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      aria-label={`Select color ${index + 1}`}
                    >
                      {selectedColor === color && <Check className="h-4 w-4 text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bone configuration for main products */}
            {!isAccessory && product.bones && product.bones.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Customize:</p>
                <div className="space-y-4">
                  {product.bones
                    .filter((bone) => bone.isConfiguration)
                    .map((bone, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <p className="text-sm font-medium mb-2">{bone.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {/* For simplicity, just showing color options */}
                          {["#FF6B6B", "#4ECDC4", "#FFD166", "#118AB2", "#073B4C"].map((color, i) => (
                            <button
                              key={i}
                              className={`w-8 h-8 rounded-full border-2 ${selectedBones[bone.name] === color ? "border-black" : "border-gray-200"}`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleBoneChange(bone.name, color)}
                              aria-label={`Select ${bone.name} color ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {addingToCart ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <ShoppingCart size={18} className="mr-2" />
                  ADD TO CART
                </span>
              )}
            </button>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-600">{product.description || "This is a product of blah blah blah"}</p>
            </div>
          </div>
        </div>

        {/* Related products section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">More products from Yadomm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-100 flex items-center justify-center h-[150px]">
                      <img
                        src={`/src/assets/images/shop/${relatedProduct.id}.png`}
                        alt={relatedProduct.name}
                        className="max-h-[120px] w-auto object-contain"
                        onError={(e) => handleImageError(e, "product", relatedProduct.name)}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs uppercase">{relatedProduct.name}</p>
                      <p className="font-bold text-sm mt-1">{relatedProduct.price?.toFixed(2)} B</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!isAuthenticated()) {
                          setShowLoginModal(true)
                        } else {
                          // Add to cart logic
                          console.log(`Adding related product ${relatedProduct.id} to cart`)
                          navigate("/starter")
                        }
                      }}
                      className="w-full bg-white border-t border-gray-200 text-black text-xs py-2 hover:bg-black hover:text-white transition-all duration-300 uppercase"
                    >
                      Add to cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer carousel={1} />

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

// 3D Model component for the regular product view
const ModelViewer = ({ modelUrl, productId }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Simple implementation - in a real app, you'd use Three.js or a similar library
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <p class="text-gray-500">3D Model: ${modelUrl}</p>
        </div>
      `
    }
  }, [modelUrl, productId])

  return <div ref={containerRef} className="w-full h-full" />
}

// Product Configurator Component
const ProductConfigurator = ({ product, configurableBones }) => {
  const navigate = useNavigate()
  const [addingToCart, setAddingToCart] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const snap = useSnapshot(state)

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
        quantity: 1,
        price: product.price,
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

  return (
    <div className="h-screen w-full bg-[#f9f9f9] relative overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10 flex items-center text-gray-600 hover:text-black"
      >
        &lt; back
      </button>

      {/* Left side content */}
      <div className="absolute top-0 left-0 w-1/2 h-full p-12 flex flex-col">
        <div className="mt-16">
          <h1 className="text-5xl font-bold uppercase mb-6">CUSTOMIZE</h1>

          <h2 className="text-2xl text-[#0c9df8] font-light mb-2">Decorate</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Begin customize with decoration, choose the shape and colors that you preferring on your own yadom!
          </p>

          <p className="text-gray-600 mb-12">Click on the part you where you want to change the color</p>

          {/* Color picker */}
          {snap.current && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <HexColorPicker
                color={snap.items[snap.current]}
                onChange={(color) => (state.items[snap.current] = color)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right side content - Part information */}
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="absolute top-32 right-12 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2">Part</h3>
          <div className="space-y-1">
            {configurableBones.map((bone) => (
              <div key={bone.id} className="flex items-center justify-between">
                <span className="text-sm">{bone.name}:</span>
                <span className="text-sm font-mono" style={{ color: bone.id === snap.current ? "#000" : "#898989" }}>
                  colors #{state.items[bone.id]?.replace("#", "") || "000000"}
                  {!bone.isConfiguration && " (can't config)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Model in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px]">
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
      </div>

      {/* Finish button */}
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className="absolute bottom-6 right-6 z-10 bg-[#85deff] text-black px-8 py-3 rounded-full hover:bg-[#6bc8f8] transition-colors disabled:opacity-70 flex items-center justify-center"
      >
        {addingToCart ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
            Adding...
          </span>
        ) : (
          <span className="flex items-center font-medium">
            FINISH <span className="ml-2">&gt;</span>
          </span>
        )}
      </button>

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

// 3D Model component for the configurator
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

export default PageTransition(ProductView)

