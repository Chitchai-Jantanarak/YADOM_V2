"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Lenis from "lenis"
import { productService } from "../services/productService"
import { useApi } from "../hooks/useApi"

import PageTransition from "../components/layout/PageTransition"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import TextCarousel from "../components/ui/TextCarousel"

const ProductDetail = () => {
  // Get product ID from URL params
  const { productId } = useParams()
  const [product, setProduct] = useState(null)

  // Use our custom hook for API calls
  const { loading, error, execute: fetchProduct } = useApi(productService.getProductById)

  // Load product details when component mounts or productId changes
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return

      const data = await fetchProduct(productId)
      if (data) {
        setProduct(data)
      }
    }

    loadProduct()
  }, [productId, fetchProduct])

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="mx-5 min-h-screen bg-white">
      <NavBar2 />

      {/* <header className="w-full flex flex-row justify-center mx-auto px-4 py-8 my-4 border-gray-200 border-b-2">
        <article>
          <h1 className="text-3xl font-bold text-center my-6">PRODUCT DETAILS</h1>
          <h3 className="text-center">View detailed information about this product</h3>
        </article>
      </header> */}

      <div className="my-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading product details...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : product ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="flex justify-center items-center">
                <img
                  src={product.imageUrl || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>

                {product.discountPrice && (
                  <p className="text-red-500">
                    Sale: ${product.discountPrice.toFixed(2)}
                    <span className="ml-2 line-through text-gray-400">${product.price.toFixed(2)}</span>
                  </p>
                )}

                <div className="my-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="my-4">
                    <h3 className="text-lg font-semibold mb-2">Features</h3>
                    <ul className="list-disc pl-5">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-gray-700">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Product Information */}
            <div className="mt-12 border-t pt-8">
              <h3 className="text-xl font-bold mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Product Type</h4>
                  <p>{product.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold">SKU</h4>
                  <p>{product.sku || "N/A"}</p>
                </div>
                {product.dimensions && (
                  <div>
                    <h4 className="font-semibold">Dimensions</h4>
                    <p>{product.dimensions}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <h4 className="font-semibold">Weight</h4>
                    <p>{product.weight}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Product not found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default PageTransition(ProductDetail)

