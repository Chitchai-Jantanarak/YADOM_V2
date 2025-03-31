"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Lenis from "lenis"
import NavBar2 from "../components/layout/NavBar2"
import Footer from "../components/layout/Footer"
import PageTransition from "../components/layout/PageTransition"

import GlobeExp from "../components/experience/globeExp"
import INHL1 from "../assets/images/AboutUs/inhaler1.jpg"
import INHL2 from "../assets/images/AboutUs/inhaler2.png"
import INHL3 from "../assets/images/AboutUs/inhaler3.jpg"
import INHL4 from "../assets/images/AboutUs/inhaler4.png"

const AboutUs = () => {
  // Setup intersection observer for breathing revolution section
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  })

  // Animation controls for breathing revolution
  const backgroundControls = useAnimation()
  const foregroundControls = useAnimation()

  // Setup intersection observer for INHL4 image section
  const [inhalerRef, inhalerInView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })

  // Animation controls for INHL4 section
  const inhalerControls = useAnimation()

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

  // Apply animations when breathing revolution section is in view
  useEffect(() => {
    if (inView) {
      backgroundControls.start({
        scale: 1,
        opacity: 0.5,
        transition: { duration: 1.2, ease: "easeOut" },
      })

      foregroundControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 1.2, delay: 0.3, ease: "easeOut" },
      })
    } else {
      backgroundControls.start({
        scale: 1.5,
        opacity: 0,
      })

      foregroundControls.start({
        scale: 0.5,
        opacity: 0,
      })
    }
  }, [inView, backgroundControls, foregroundControls])

  // Apply animations when INHL4 section is in view
  useEffect(() => {
    if (inhalerInView) {
      inhalerControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          ease: "easeOut",
          staggerChildren: 0.1,
        },
      })
    } else {
      inhalerControls.start({
        opacity: 0,
        y: 50,
        scale: 0.95,
      })
    }
  }, [inhalerInView, inhalerControls])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Use imported NavBar2 component */}
      <NavBar2 />

      <main className="flex-1">
        {/* Hero Section - Modified for responsive layout */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              {/* Large HEY THERE text - responsive sizing */}
              <div className="w-full md:w-1/2">
                <h1 className="text-5xl sm:text-6xl md:text-[7rem] lg:text-[9rem] leading-[0.9] font-bold text-gray-800">
                  HEY
                  <br />
                  THERE
                </h1>
              </div>

              {/* Right aligned text - responsive width */}
              <div className="w-full md:w-2/5 pt-4">
                <p className="text-xl md:text-2xl font-thin leading-loose">
                  We believe that something as essential as breathing should be both effective and uniquely yours.
                  That's why we created the world's first fully customizable inhalers—so you can breathe easier with a
                  device that fits your lifestyle, personality, and needs.
                </p>
              </div>
            </div>

            {/* Product images in a row - responsive grid */}
            <div className="mt-12 md:mt-24 w-full">
              <div className="flex flex-row w-full justify-center items-center gap-8">
                <div className="flex items-center justify-center flex-1">
                  <img
                    src={INHL3 || "/placeholder.svg"}
                    alt="Inhaler design 1"
                    className="h-48 md:h-60 lg:h-72 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center flex-1">
                  <img
                    src={INHL1 || "/placeholder.svg"}
                    alt="Inhaler design 2"
                    className="h-48 md:h-60 lg:h-72 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center flex-1">
                  <img
                    src={INHL2 || "/placeholder.svg"}
                    alt="Inhaler design 3"
                    className="h-48 md:h-60 lg:h-72 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced INHL4 section - full width with animations */}
        <motion.div
          ref={inhalerRef}
          className="relative w-full h-[60vh] overflow-hidden my-12 bg-gradient-to-r from-blue-50 to-purple-50"
          initial={{ opacity: 0, y: 50 }}
          animate={inhalerControls}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-500"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                }}
              />
            ))}
          </div>

          {/* Content container */}
          <div className="container mx-auto h-full flex flex-col md:flex-row items-center justify-between px-4 py-12 relative z-10">
            {/* Left text column */}
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: inhalerInView ? 1 : 0,
                x: inhalerInView ? 0 : -50,
              }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: inhalerInView ? 1 : 0,
                  y: inhalerInView ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Breathe <span className="text-blue-600">Differently</span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-600 mb-6 max-w-lg mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: inhalerInView ? 1 : 0,
                  y: inhalerInView ? 0 : 20,
                }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our premium inhaler combines cutting-edge technology with sleek design, providing both functionality and
                style for your respiratory needs.
              </motion.p>
            </motion.div>

            {/* Right image column with floating animation */}
            <motion.div
              className="w-full md:w-1/2 flex justify-center items-center relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: inhalerInView ? 1 : 0,
                scale: inhalerInView ? 1 : 0.8,
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Animated circles */}
              <motion.div
                className="absolute w-64 h-64 rounded-full border-2 border-blue-300 opacity-70"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <motion.div
                className="absolute w-80 h-80 rounded-full border-2 border-purple-300 opacity-60"
                animate={{
                  scale: [1.1, 1.3, 1.1],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.5,
                }}
              />

              {/* Floating inhaler image */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <img
                  src={INHL4 || "/placeholder.svg"}
                  alt="Premium inhaler design"
                  className="h-64 md:h-80 lg:h-96 object-contain z-10 relative drop-shadow-2xl"
                />
              </motion.div>

              {/* Animated highlight spots */}
              <motion.div
                className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-blue-400 blur-sm"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />

              <motion.div
                className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-purple-400 blur-sm"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 0.7,
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* WHY WE EXIST Section - responsive text alignment */}
        <section className="py-4 mt-8 md:mt-16">
          <div className="container mx-auto px-4">
            <div className="border-t border-gray-300 mb-8 md:mb-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-left md:text-right mb-4 md:mb-8">WHY WE EXIST</h2>
            <div className="flex justify-start md:justify-end">
              <p className="w-full md:w-1/2 text-left md:text-right text-xl md:text-2xl leading-loose">
                Let's be real—traditional inhalers? Pretty boring. We wanted to change that. Whether you want a sleek,
                modern design, a pop of color, or even a tech-savvy smart inhaler, we've got you covered. Because
                managing asthma or other respiratory conditions shouldn't mean sacrificing style, comfort, or
                innovation.
              </p>
            </div>
            <div className="border-b border-gray-300 mt-8 md:mt-16"></div>
          </div>
        </section>

        {/* BREATHING REVOLUTION Section with Zoom Effects - made responsive */}
        <section className="py-6 overflow-hidden my-12" ref={ref}>
          <div className="container mx-auto px-4">
            <div className="relative flex justify-center items-center h-40 sm:h-48 md:h-64">
              {/* Background faded text with zoom animation - Increased text size */}
              <motion.div
                className="absolute text-[#c7d0f7] text-opacity-50 font-bold text-6xl sm:text-8xl md:text-[10rem] tracking-wide text-center"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={backgroundControls}
              >
                JOIN THE
                <br />
                REVOLUTION
              </motion.div>

              {/* Foreground bold text with zoom animation - Increased text size */}
              <motion.div
                className="absolute text-black font-black text-6xl sm:text-8xl md:text-[10rem] tracking-wide z-10 text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={foregroundControls}
              >
                BREATHING
              </motion.div>

              {/* Pulse effect - responsive sizing */}
              <motion.div
                className="absolute w-64 sm:w-80 md:w-[30rem] h-20 sm:h-28 md:h-36 bg-gray-100 rounded-full filter blur-xl"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.2, 0],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 3,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container mx-auto px-8">
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-12 text-center">
              Sustainability Statement
            </h2>

            {/* Content row - text and image side by side */}
            <div className="flex flex-col md:flex-row items-center gap-28">
              {/* Text column */}
              <div className="w-full md:w-2/3 text-xl md:text-2xl lg:text-3xl leading-loose text-gray-700">
                &nbsp;&nbsp;&nbsp;&nbsp; At Yadomm, we believe that self-care should go hand in hand with caring for the planet. That's why we
                are committed to using eco-friendly, recyclable packaging materials and minimizing waste in every step
                of our process. Our inhalers are designed not only to refresh your senses, but also to reflect a mindful
                lifestyle that values sustainability, simplicity, and responsibility. Because taking a deep breath
                should never come at the cost of the Earth.
              </div>

              {/* 3D Earth model (replacing static image) */}
              <motion.div
                className="w-full md:w-1/4 h-[300px] md:h-[400px] relative"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ delay: 0.2 }}
              >
                {/* Animated rings around the globe */}
                <motion.div
                  className="absolute max-md:hidden inset-0 z-0 rounded-full border-2 border-green-300 opacity-70"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: {
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    },
                  }}
                />

                <motion.div
                  className="absolute max-md:hidden inset-0 z-0 rounded-full border-2 border-blue-300 opacity-50"
                  style={{
                    transform: "rotateX(70deg)",
                    width: "90%",
                    height: "90%",
                    margin: "5%",
                  }}
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Globe component */}
                <div className="relative z-10 h-full">
                  <GlobeExp />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Use imported Footer component */}
      <Footer carousel="true" />
    </div>
  )
}

export default PageTransition(AboutUs)

