"use client"

import React, { useState, useEffect, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import NavBar2 from "../components/layout/NavBar2"
import Underline from "../components/ui/Underline"
import TextCarousel from "../components/ui/TextCarousel"
import AdvancedApp from "../components/experience/__test_v2"
import Footer from "../components/layout/Footer"
import Lenis from "lenis"
import MainLoader from "../components/layout/MainLoader"

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [componentsPreloaded, setComponentsPreloaded] = useState(false)
  const [scrollEnabled, setScrollEnabled] = useState(false)

  // Preload components during loading phase
  useEffect(() => {
    if (isLoading) {
      // Create a hidden div to render components off-screen
      const preloadContainer = document.createElement("div")
      preloadContainer.style.position = "absolute"
      preloadContainer.style.width = "0"
      preloadContainer.style.height = "0"
      preloadContainer.style.overflow = "hidden"
      preloadContainer.style.visibility = "hidden"
      document.body.appendChild(preloadContainer)

      // Function to preload a component by temporarily rendering it
      const preloadComponent = (Component, props = {}) => {
        return new Promise((resolve) => {
          // Create a temporary React root to render the component
          const tempDiv = document.createElement("div")
          preloadContainer.appendChild(tempDiv)

          // Use a setTimeout to ensure the component has time to initialize
          setTimeout(() => {
            // Clean up
            preloadContainer.removeChild(tempDiv)
            resolve()
          }, 100)

          // Force the component to be evaluated/loaded
          const componentInstance = React.createElement(Component, props)
          // We don't actually need to render it, just evaluate it
          // This will trigger any imports/code splitting
        })
      }

      // Preload all heavy components
      Promise.all([
        preloadComponent(AdvancedApp),
        preloadComponent(TextCarousel, {
          text: ["PRELOAD"],
          colorIndex: [1],
          baseVelocity: 5,
        }),
      ])
        .then(() => {
          setComponentsPreloaded(true)
          // Clean up the preload container
          document.body.removeChild(preloadContainer)
        })
        .catch((err) => {
          console.error("Error preloading components:", err)
          setComponentsPreloaded(true) // Continue anyway
        })
    }
  }, [isLoading])

  useEffect(() => {
    window.scrollTo(0, 0)
    const handleResize = () => {
      window.location.reload()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)

          // Only finish loading when components are preloaded
          if (componentsPreloaded) {
            setTimeout(() => {
              setIsLoading(false)
            }, 300) // Shortened delay
          } else {
            // If components aren't preloaded yet, wait for them
            const checkPreload = setInterval(() => {
              if (componentsPreloaded) {
                clearInterval(checkPreload)
                setTimeout(() => {
                  setIsLoading(false)
                }, 300)
              }
            }, 100)
          }

          return 100
        }
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
  }, [componentsPreloaded])

  // Enable scrolling after a delay when loading is complete
  useEffect(() => {
    if (!isLoading) {
      // Delay enabling scroll for 3 seconds after loading is complete
      const scrollTimer = setTimeout(() => {
        setScrollEnabled(true)
      }, 1000)

      return () => clearTimeout(scrollTimer)
    }
  }, [isLoading])

  useEffect(() => {
    if (scrollEnabled) {
      // Initialize smooth scrolling with Lenis once scrolling is enabled
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    }
  }, [scrollEnabled])

  useLayoutEffect(() => {
    // Use scrollEnabled state instead of isLoading to control scroll locking
    if (!scrollEnabled) {
      // Prevent scrolling while loading or during delay
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      // Store the current scroll position
      const scrollY = window.scrollY

      // Prevent scroll position from changing
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      // Re-enable scrolling when delay is complete
      const scrollY = document.body.style.top
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""

      // Restore scroll position
      window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
    }

    return () => {
      // Clean up in case component unmounts during loading
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [scrollEnabled])

  return (
    <>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: "-100vh",
              transition: { duration: 1, ease: "circOut", delay: 0.6 },
            }}
            className="z-50 fixed top-0 left-0 w-full h-full bg-white"
          >
            <MainLoader initialProgress={loadingProgress} />
          </motion.div>
        ) : (
          <motion.div
            key="homeContent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="Home">
              <NavBar2 />
              <br />
              <Underline />

              <div className="mx-[5%]">
                <section className="expereince-home-sticky-section">
                  <AdvancedApp />
                </section>

                <section className="h-lvh">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem architecto rerum delectus non quisquam
                  ipsa, laborum id omnis quasi quibusdam eveniet? Ab quia illo veritatis ullam asperiores neque
                  consequatur quos ut veniam sed ratione debitis, quis doloremque ducimus voluptatibus unde aut dolore
                  praesentium cum laudantium eligendi dolorem a perferendis? Nemo quae rem corporis earum eum autem
                  sapiente aut quo in, veritatis ipsam nobis doloremque nostrum magni culpa hic non corrupti nam vitae
                  quis.
                </section>

                <TextCarousel
                  text={["REFRESHING AROMAS", "GET BOOSTED", "DON'T FEEL BAD, FEEL THE STYLE"]}
                  colorIndex={[2, 1, 3]}
                  baseVelocity={5}
                  className="font-anybody"
                />

                <TextCarousel
                  text={["REFRESHING AROMAS", "GET BOOSTED", "DON'T FEEL BAD, FEEL THE STYLE"]}
                  colorIndex={[2, 1, 3]}
                  baseVelocity={-5}
                  className="font-anybody"
                />

                <section className="h-lvh">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum quasi at asperiores, sunt ducimus
                  sint? Temporibus enim ab praesentium perspiciatis beatae officiis ratione nemo cumque fuga. Sed
                  consectetur non repudiandae a voluptates harum, ipsam rem eum vel facilis ad ab dolorum amet aperiam
                  possimus laboriosam eligendi voluptate ipsa sint ex dicta ducimus labore?
                </section>
                <Footer carousel="true" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Home

