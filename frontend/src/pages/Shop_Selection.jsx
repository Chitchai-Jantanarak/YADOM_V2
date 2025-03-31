"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import Lenis from "lenis"
import { useNavigate } from "react-router-dom"
import PageTransition from "../components/layout/PageTransition"
import CarouselImage from "../components/ui/CarouselImage"
import CarouselCard from "../components/ui/CarouselCard"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import { productService } from "../services/productService"

import HERO1 from "../assets/images/Product/pastelPi.png"
import HERO2 from "../assets/images/Product/pastelGr.png"
import HERO3 from "../assets/images/Product/pastelBl.png"
import HERO4 from "../assets/images/Product/pastelOr.png"
import ACC from "../assets/images/Product/accessories.png"
import MAIN from "../assets/images/Product/product.png"

const Shop_Selection = () => {
  const navigate = useNavigate()
  const [spotlightProducts, setSpotlightProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const shopOptionsRef = useRef(null)

  // Hero carousel images
  const heroImages = [
    { src: HERO1, alt: "Pink Inhaler" },
    { src: HERO2, alt: "Green Inhaler" },
    { src: HERO3, alt: "Blue Inhaler" },
    { src: HERO4, alt: "Orange Inhaler" },
  ]

  // Fetch spotlight products
  useEffect(() => {
    const fetchSpotlightProducts = async () => {
      try {
        setLoading(true)
        // Fetch a mix of products and accessories
        const data = await productService.getAvailableProducts({
          limit: 8,
          featured: true,
        })

        // Transform products for the carousel
        const transformedProducts = data.products.map((product) => ({
          id: product.id,
          src: `/src/assets/images/shop/${product.id}.png`,
          alt: product.name,
          title: product.name,
          price: product.price.toFixed(2),
          type: product.type,
        }))

        setSpotlightProducts(transformedProducts)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching spotlight products:", err)
        setLoading(false)

        // Fallback spotlight products if API fails
        setSpotlightProducts([
          {
            id: 1,
            src: "/src/assets/images/shop/1.png",
            alt: "Blue Chain",
            title: "BLUE CHAIN",
            price: "12.99",
            type: "ACCESSORY",
          },
          {
            id: 2,
            src: "/src/assets/images/shop/2.png",
            alt: "Red Chain",
            title: "RED CHAIN",
            price: "14.99",
            type: "ACCESSORY",
          },
          {
            id: 3,
            src: "/src/assets/images/shop/3.png",
            alt: "Green Chain",
            title: "GREEN CHAIN",
            price: "11.99",
            type: "ACCESSORY",
          },
          {
            id: 4,
            src: "/src/assets/images/shop/4.png",
            alt: "Yellow Chain",
            title: "YELLOW CHAIN",
            price: "13.99",
            type: "ACCESSORY",
          },
          {
            id: 5,
            src: "/src/assets/images/shop/5.png",
            alt: "Purple Chain",
            title: "PURPLE CHAIN",
            price: "12.99",
            type: "ACCESSORY",
          },
        ])
      }
    }

    fetchSpotlightProducts()
  }, [])

  // Initialize Lenis for smooth scrolling
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

  // Function to handle URL hash on page load
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1) // Remove the # character
      const element = document.getElementById(id)

      if (element) {
        // Give the page a moment to load
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }, 500)
      }
    }
  }, [])

  // Scroll to shop options section
  const scrollToShopOptions = () => {
    if (shopOptionsRef.current) {
      shopOptionsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="shopselection min-h-screen bg-white">
      <div>
        <NavBar2 />
      </div>

      <div className="mx-[5%] py-8">
        {/* Hero Carousel */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-h-[70vh] h-[70vh] relative flex justify-center items-center my-[5%] overflow-hidden rounded-lg"
        >
          <CarouselImage images={heroImages} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-[5]"></div>
        </motion.header>

        <div className="max-w-6xl mx-auto px-4">
          {/* Spotlight Section */}
          <div className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <h2 className="font-archivo font-black text-3xl mb-2">SPOTLIGHT</h2>
                <p className="text-gray-600">Our featured products</p>
              </div>
              <button
                onClick={scrollToShopOptions}
                className="mt-4 md:mt-0 text-sm font-medium text-black border-b-2 border-black pb-1 hover:text-gray-700 hover:border-gray-700 transition-colors"
              >
                View All Products
              </button>
            </div>

            <div className="h-[300px]">
              {" "}
              {/* Fixed height for the carousel */}
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
              ) : (
                <CarouselCard images={spotlightProducts} />
              )}
            </div>
          </div>

          {/* Shop Options Section - New section for selecting between products and accessories */}
          <div ref={shopOptionsRef} className="mb-24 pt-8" id="shop-options">
            <h2 className="text-3xl font-black text-center mb-12">SHOP CATEGORIES</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Inhalers Card */}
              <Link to={"/Shop_Product"} >
                <div className="h-64 overflow-hidden">
                  <img
                    src={MAIN || "/placeholder.svg"}
                    alt="Inhalers"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">INHALERS</h3>
                  <p className="text-gray-600 mb-4">Premium, customizable inhalers for your needs</p>
                  <button className="text-black font-medium flex items-center">
                    Shop Inhalers
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Link>

              {/* Accessories Card */}
              <Link to={"/Shop_Accessory"} >
                <div className="h-64 overflow-hidden">
                  <img
                    src={ACC || "/placeholder.svg"}
                    alt="Accessories"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">ACCESSORIES</h3>
                  <p className="text-gray-600 mb-4">Stylish accessories to complement your inhaler</p>
                  <button className="text-black font-medium flex items-center">
                    Shop Accessories
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </Link>
            </div>
          </div>

          {/* Product Categories - Kept for additional information */}
          <div id="inhalers" className="mb-24 pt-8">
            <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-50 rounded-lg p-8">
              {/* Text content */}
              <div className="w-full md:w-1/2 space-y-4">
                <p className="text-gray-500 font-medium">FOR YOUR LUNGS</p>
                <h2 className="text-4xl font-black mb-2">INHALERS</h2>
                <p className="text-gray-600 mb-6">
                  Experience our premium, customizable inhalers designed for comfort and style.
                </p>
                <button
                  onClick={() => {
                    navigate("/Shop_Product");
                    setTimeout(() => window.scrollTo(0, 0), 0);
                  }}
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Shop Inhalers
                </button>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={MAIN || "/placeholder.svg"}
                  alt="Green Inhaler"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          <div id="accessories" className="mb-24 pt-8">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 bg-gray-50 rounded-lg p-8">
              {/* Text content */}
              <div className="w-full md:w-1/2 space-y-4">
                <p className="text-gray-500 font-medium">FOR YOU</p>
                <h2 className="text-4xl font-black mb-2">ACCESSORIES</h2>
                <p className="text-gray-600 mb-6">
                  Complement your inhaler with our stylish accessories, from chains to cases.
                </p>
                <button
                  onClick={() => {
                    navigate("/Shop_Accessory");
                    setTimeout(() => window.scrollTo(0, 0), 0);
                  }}
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Shop Accessories
                </button>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={ACC || "/placeholder.svg"}
                  alt="Accessories"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer carousel="true" />
    </div>
  )
}

export default PageTransition(Shop_Selection)

