import { useEffect } from "react"
import Lenis from "lenis"
import PageTransition from "../components/layout/PageTransition"
import CarouselImage from "../components/ui/CarouselImage"
import CarouselCard from "../components/ui/CarouselCard"
import ProductSection from "../components/ui/ProductSection"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"

import HERO1 from "../assets/images/Product/pastelPi.png"
import HERO2 from "../assets/images/Product/pastelGr.png"
import HERO3 from "../assets/images/Product/pastelBl.png"
import HERO4 from "../assets/images/Product/pastelOr.png"
import ACC from "../assets/images/Product/accessories.png"
import MAIN from "../assets/images/Product/product.png"

const Shop_Selection = () => {

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
  // Hero carousel images
  const heroImages = [
    { src: HERO1, alt: "Pink Inhaler" },
    { src: HERO2, alt: "Green Inhaler" },
    { src: HERO3, alt: "Blue Inhaler" },
    { src: HERO4, alt: "Orange Inhaler" },
  ]

  // Spotlight product images
  const spotlightImages = [
    {
      src: "https://placehold.co/200x200/e0ffff/fff?text=Product+1",
      alt: "Product 1",
      title: "ICY CHAIN",
      price: "12.99",
    },
    {
      src: "https://placehold.co/200x200/ffff99/fff?text=Product+2",
      alt: "Product 2",
      title: "FUN CHAIN",
      price: "14.99",
    },
    {
      src: "https://placehold.co/200x200/f5f5dc/fff?text=Product+3",
      alt: "Product 3",
      title: "BEIGE CHAIN",
      price: "11.99",
    },
    {
      src: "https://placehold.co/200x200/e6e6fa/fff?text=Product+4",
      alt: "Product 4",
      title: "LILAC CHAIN",
      price: "13.99",
    },
    {
      src: "https://placehold.co/200x200/e0ffff/fff?text=Product+5",
      alt: "Product 5",
      title: "ICY CHAIN",
      price: "12.99",
    },
  ]

  // Initialize Lenis
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
      const id = window.location.hash.substring(1); // Remove the # character
      const element = document.getElementById(id);
      
      if (element) {
        // Give the page a moment to load
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 500);
      }
    }
  }, []);

  return (
    <div className="shopselection">
      <div>
        <NavBar2 />
      </div>

    <div className="mx-[5%]">

    
      {/* Hero Carousel */}
      <header className="max-h-[70vh] h-[70vh] relative flex justify-center items-center my-[5%] overflow-hidden">
        <CarouselImage images={heroImages} />
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Spotlight Section */}
        <div>
            <header className="font-archivo font-black text-3xl mb-4">SPOTLIGHT</header>
            <CarouselCard images={spotlightImages} />
        </div>

        {/* Product Categories - with IDs for navigation targeting */}
        <div id="inhalers">
          <ProductSection
            title="INHALERS"
            subtitle="FOR YOUR LUNGS"
            image={{
              src: MAIN,
              alt: "Green Inhaler",
            }}
          />
        </div>

        <div id="accessories">
          <ProductSection
            title="ACCESSORIES"
            subtitle="FOR YOU"
            image={{
              src: ACC,
              alt: "Accessories",
            }}
          />
        </div>
      </div>
      </div>
      <Footer carousel="true" />
    </div>
  )
}

export default PageTransition(Shop_Selection)