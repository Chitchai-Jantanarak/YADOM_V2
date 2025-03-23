import { useEffect } from "react"
import Lenis from "lenis"

import PageTransition from "../components/layout/PageTransition"
import CarouselImage from "../components/ui/CarouselImage"
import CarouselCard from "../components/ui/CarouselCard"
import ProductSection from "../components/ui/ProductSection"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"

const Shop_Selection = () => {
  // Hero carousel images
  const heroImages = [
    { src: "https://placehold.co/600x400/ff9a9e/fff?text=Pastel+Pink", alt: "Pink Inhaler" },
    { src: "https://placehold.co/600x400/98fb98/fff?text=Pastel+Green", alt: "Green Inhaler" },
    { src: "https://placehold.co/600x400/add8e6/fff?text=Pastel+Blue", alt: "Blue Inhaler" },
    { src: "https://placehold.co/600x400/ffb347/fff?text=Pastel+Orange", alt: "Orange Inhaler" },
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

  return (
    <div className="shopselection mx-[5%]">
      <div>
        <NavBar2 />
      </div>

      {/* Hero Carousel */}
      <header className="max-h-[70vh] h-[70vh] relative flex justify-center items-center my-[5%] overflow-hidden">
        <CarouselImage images={heroImages} />
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Spotlight Section */}
        <div>
            <header className="font-archivo font-black text-3xl mb-4"> SPOTLIGHT </header>
            <CarouselCard images={spotlightImages} />
        </div>

        {/* Product Categories */}
        <ProductSection
          title="INHALERS"
          subtitle="FOR YOUR LUNGS"
          image={{
            src: "https://placehold.co/400x400/98fb98/fff?text=Pastel+Green",
            alt: "Green Inhaler",
          }}
        />

        <ProductSection
          title="ACCESSORIES"
          subtitle="FOR YOU"
          image={{
            src: "https://placehold.co/400x400/ffcccb/fff?text=Accessories",
            alt: "Accessories",
          }}
        />

      </div>
      <Footer carousel="true" />
    </div>
  )
}

export default PageTransition(Shop_Selection)

