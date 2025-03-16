import { useEffect } from "react";
import Lenis from "lenis";

import PageTransition from "../components/layout/PageTransition";
import NavBar2 from "../components/layout/NavBar2";
import Footer from "../components/layout/Footer";
import ProductGrid from "../components/ui/ProductGrid";
import TextCarousel from "../components/ui/TextCarousel";

const Shop_Accessory = () => {
  // Sample product data
  const products = [
    {
      id: "KC-001",
      name: "KEY CHAIN",
      type: "PAW",
      price: "60.00 ฿",
      image: "https://placehold.co/300x300/f0f0f0/fff?text=Paw+Keychain",
      colors: ["#B0C4DE", "#F0F8FF", "#FFDAB9"],
    },
    {
      id: "KC-002",
      name: "KEY CHAIN",
      type: "SMILE",
      price: "60.00 ฿",
      image: "https://placehold.co/300x300/f0f0f0/fff?text=Smile+Keychain",
      colors: ["#FFFFE0", "#F0F8FF", "#FFDAB9"],
    },
    {
      id: "KC-003",
      name: "KEY CHAIN",
      type: "BUTTERFLY",
      price: "60.00 ฿",
      image: "https://placehold.co/300x300/f0f0f0/fff?text=Butterfly+Keychain",
      colors: ["#F5F5DC", "#FFC0CB", "#FFDAB9"],
    },
    {
      id: "KC-004",
      name: "KEY CHAIN",
      type: "MOON",
      price: "60.00 ฿",
      image: "https://placehold.co/300x300/f0f0f0/fff?text=Moon+Keychain",
      colors: ["#E0FFFF", "#B0E0E6", "#FFDAB9"],
    },
    {
      id: "KC-005",
      name: "KEY CHAIN",
      type: "ROPE",
      price: "60.00 ฿",
      image: "https://placehold.co/300x300/f0f0f0/fff?text=Rope+Keychain",
      colors: ["#E6E6FA", "#F0F8FF", "#FFDAB9"],
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
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="mx-5 min-h-screen bg-white">
      <NavBar2 />
      
      <header className="w-full flex flex-row justify-center mx-auto px-4 py-8 my-4 border-gray-200 border-b-2">
        <article>
            <h1 className="text-3xl font-bold text-center my-6">ACCESSORIES</h1>
            <h3>Small gadget accessories • decorate your inhalers</h3>
        </article>
      </header>
        
        <TextCarousel 
            text={["ACCESSORIES", "ACCESSORIES", "ACCESSORIES"]}
            colorIndex={[4]}
            font="poppins"
        />
        
        <div className="my-8">
          <ProductGrid products={products} />
        </div>
      
      <Footer carousel={1} />
    </div>
  );
};

export default PageTransition(Shop_Accessory);
