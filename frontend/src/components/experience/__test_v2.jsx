import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment, RoundedBox, PerspectiveCamera } from '@react-three/drei';
import { a, config, useSpring } from '@react-spring/three';
import { GlobalCanvas, SmoothScrollbar, UseCanvas } from '@14islands/r3f-scroll-rig';
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import SectionText from '../../utils/SectionText';
import Model1_exp from '../models/Model1_exp';
import Arrow from '../ui/Arrow';
import Emoji from '../ui/Emoji';


gsap.registerPlugin(ScrollTrigger);

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  const { viewport } = useThree();
  
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return {
    width: size[0],
    height: size[1],
    aspect: size[0] / size[1],
    viewport,
  }
};

const size = 100;  
const sizeInner = 80; 

const AnimatedModel1 = a(Model1_exp);

const AnimatedModel = ({ scale, scrollState, inViewport }) => {
  const { width } = useWindowSize()
  const modelRef = useRef()
  const innerModelLRef = useRef()
  const innerModelRRef = useRef()

  const tl = useRef()
  const tlRotation = useRef()
  const tlColor3 = useRef()
  const tlColor4 = useRef()
  const tlColor5 = useRef()
  const tlSplit = useRef()

  const size = 1
  const sizeInner = 1

  // Spring animations for main and inner model scales
  const springMain = useSpring({
    scale: inViewport ? size : 0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 300 : 0,
  })

  const springInner = useSpring({
    scale: inViewport ? sizeInner : 0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 300 : 0,
  })

  const [mainColor, setMainColor] = useState("#1e88e5")
  const [innerModelOpacity, setInnerModelOpacity] = useState(0)
  const [mainModelOpacity, setMainModelOpacity] = useState(1)
  const [splitProgress, setSplitProgress] = useState(0)

  useEffect(() => {
    if (!(modelRef.current && innerModelLRef.current && innerModelRRef.current)) return

    // Section 1: Move model to center
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-2",
        start: "40% top",
        end: "bottom top",
        scrub: 1,
      },
    })
    tl.current.fromTo(modelRef.current.position, { x: width * 0.2 }, { x: 0, ease: "power2.inOut" })

    // Rotation over sections 3-5
    tlRotation.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-3",
        start: "top top",
        endTrigger: ".experience-section-5",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    tlRotation.current.to(modelRef.current.rotation, { y: Math.PI * 4.66, ease: "linear" })

    // Section 3: Change color to red
    tlColor3.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-3",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: () => {
          const progress = tlColor3.current.progress()
          if (progress > 0.5) {
            setMainColor("#e53935")
          }
        },
      },
    })

    // Section 4: Change color to green
    tlColor4.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-4",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: () => {
          const progress = tlColor4.current.progress()
          if (progress > 0.5) {
            setMainColor("#43a047")
          }
        },
      },
    })

    // Section 5: Change color to purple
    tlColor5.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-5",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: () => {
          const progress = tlColor5.current.progress()
          if (progress > 0.5) {
            setMainColor("#8e24aa")
          }
        },
      },
    })

    // Section 6: Split animation & inner model opacity
    tlSplit.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-6",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onEnter: () => {
          // Initialize inner models at the main model's position
          const mainPos = modelRef.current.position
          innerModelLRef.current.position.set(mainPos.x, mainPos.y, mainPos.z)
          innerModelRRef.current.position.set(mainPos.x, mainPos.y, mainPos.z)

          // Set initial rotations
          innerModelLRef.current.rotation.set(0, 0, 0)
          innerModelRRef.current.rotation.set(0, 0, 0)
        },
        onUpdate: (self) => {
          const progress = self.progress
          setSplitProgress(progress)

          setInnerModelOpacity(progress)

          // Calculate split distance based on screen width
          const splitDistance = width * 0.15 // 15% of screen width
          const maxRotation = Math.PI / 6 // 30 degrees rotation

          // Apply position and rotation changes only when we're starting to split
          if (progress > 0.1) {
            const splitFactor = Math.min((progress - 0.1) * 0.75, 1) // Normalized progress for split animation

            // Left model movement
            innerModelLRef.current.position.x = -splitDistance * splitFactor
            innerModelLRef.current.rotation.z = maxRotation * splitFactor

            // Right model movement
            innerModelRRef.current.position.x = splitDistance * splitFactor
            innerModelRRef.current.rotation.z = -maxRotation * splitFactor
          }
        },
      },
    })

    return () => {
      ;[tl, tlRotation, tlColor3, tlColor4, tlColor5, tlSplit].forEach((t) => {
        if (t.current) t.current.kill()
      })
    }
  }, [width])

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <Environment preset="dawn" />
      <PerspectiveCamera>
        {/* Main model that will become invisible during split */}
        <AnimatedModel1
          ref={modelRef}
          scale={springMain.scale}
          position={[0, 0, 0]}
          color={mainColor}
          opacity={mainModelOpacity}
        />

        {/* Left half model */}
        <AnimatedModel1
          ref={innerModelLRef}
          scale={springInner.scale}
          position={[0, 0, 0]}
          color={mainColor}
          opacity={innerModelOpacity}
        />

        {/* Right half model */}
        <AnimatedModel1
          ref={innerModelRRef}
          scale={springInner.scale}
          position={[0, 0, 0]}
          color={mainColor}
          opacity={innerModelOpacity}
        />
      </PerspectiveCamera>
    </>
  )
}


// A sticky section component that defines multiple scroll sections and integrates the canvas.
const StickySection = () => {
  const el = useRef();
  const containerRef = useRef(null);

  useEffect(() => {
    // Set the initial background color for the body
    document.body.style.backgroundColor = "#ffffff";
    
    // Optionally create a global ScrollTrigger for debugging (markers can be enabled by setting markers: true)
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
    });

    return () => {
      // Reset background color when the component unmounts
      document.body.style.backgroundColor = "";
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section ref={containerRef}>
      <div className="experience-home-sticky-container relative">
        {/* -------------------------------
            Section 1 - Refresh Your Feeling
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-1"
          style={{ height: "100vh", width: "100%", zIndex: "10" }}
        >
          <SectionText 
            triggerElement=".experience-section-1" 
            backgroundColor="#ffffff" 
            startPosition="center top"
            endPosition="bottom center"
          >
            <div className="absolute left-[5%] top-[30%] transform -translate-y-1/2 max-w-[60%] space-y-10">
              <div className="space-y-6">
                <article className="flex items-center space-x-2">
                  <h2 className="max-md:text-3xl text-7xl font-bold uppercase">REFRESH</h2>
                  <span className="max-md:text-2xl text-6xl">YOUR FEELING</span>
                </article>
                <h2 className="max-md:text-2xl text-6xl uppercase">WITH YOUR OWN STYLE</h2>
              </div>
              <p>Begin design your own yadom now!</p>
              <button className="mt-4 px-6 py-2 text-white bg-sky-300 rounded-full flex items-center gap-2 group shadow-md">
                <h5>Customize</h5>
                <Arrow />
              </button>
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 2 - Pocket-sized Freshness
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-2"
          style={{ height: "100vh", width: "100%", zIndex: "10" }}
        >
          <SectionText 
            triggerElement=".experience-section-2"
            backgroundColor="#f0f8ff"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
              <article className="space-y-4">
                <h2 className="max-md:text-2xl text-6xl font-bold uppercase">POCKET-SIZED</h2>
                <h2 className="max-md:text-2xl text-6xl font-bold uppercase">FRESHNESS</h2>
                <h2 className="max-md:text-2xl text-6xl font-bold uppercase">FOR EVERY</h2>
                <h2 className="max-md:text-2xl text-6xl font-bold uppercase">MOMENT</h2>
              </article>
              <p>
                Keep Yadomm in your pocket. Let’s be <br />the essence for your every day life
              </p>
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 3 - Say Goodbye
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-3"
          style={{ height: "100vh", width: "100%", zIndex: "1" }}
        >
          <SectionText 
            triggerElement=".experience-section-3"
            backgroundColor="#000000"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2">
              <h1 className="relative left-[5%] text-9xl font-bold mb-2 uppercase text-white tracking-wide">SAY GOODBYE TO</h1>
              <div className='relative left-[15%] flex flex-row space-x-6'>
                <Emoji /> <Emoji /> <Emoji />
                <h1 className="text-9xl font-medium mb-4 uppercase text-white tracking-wide">BAD FEELINGS</h1>
              </div>
              <h1 className="relative left-[5%] text-9xl font-bold mb-2 uppercase text-white tracking-wide">SAY HELLO TO</h1>
              <h1 className="relative left-[25%] text-9xl font-medium mb-4 uppercase text-white tracking-wide">FRESHNESS</h1>
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 4 - Customize Your Inhaler
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-4"
          style={{ height: "100vh", width: "100%", zIndex: "1" }}
        >
          <SectionText 
            triggerElement=".experience-section-4"
            backgroundColor="#bbbdff"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div>
              <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
                <h2 className="text-6xl font-bold font-zentokyozoo mb-4 uppercase text-white">CUSTOMIZE</h2>
                <h2 className="text-6xl font-bold font-zentokyozoo mb-12 uppercase text-white">YOUR</h2>
                <h3 className="text-4xl font-medium font-archivo uppercase text-white">INHALER</h3>
              </div>
              <div className="absolute left-[60%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
                <div className="mt-4">
                  <h5 className="text-2xl mb-12">
                    Decorate the appearance of
                    the inhaler by your own preference. You can change any of these below
                  </h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">1. Case Shape</h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">2. Color</h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">3. Pattern</h5>
                </div>
              </div>
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 5 - Customize Your Feelings
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-5"
          style={{ height: "100vh", width: "100%", zIndex: "1" }}
        >
          <SectionText 
            triggerElement=".experience-section-5"
            backgroundColor="#d5f2e3"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div>
              <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
                <h2 className="text-6xl font-bold font-zentokyozoo mb-4 uppercase text-white">CUSTOMIZE</h2>
                <h2 className="text-6xl font-bold font-zentokyozoo mb-12 uppercase text-white">YOUR</h2>
                <h3 className="text-4xl font-medium font-archivo uppercase text-white">FEELINGS</h3>
              </div>
              <div className="absolute left-[60%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
                <div className="mt-4">
                  <h5 className="text-2xl mb-12"> 
                    We have so many aromas type for your best suitable in every moment
                  </h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">1. Herb</h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">2. Lavender</h5>
                  <h5 className="text-2xl mb-6 border-spacing-4 border-b-2 border-black">3. Fruity</h5>
                </div>
              </div>
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 6 - Experience the Difference (Split Animation)
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-6"
          style={{ height: "100vh", width: "100%", zIndex: "1" }}
        >
          <SectionText 
            triggerElement=".experience-section-6"
            backgroundColor="#f5f5f5"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
              
            </div>
          </SectionText>
        </div>

        {/* -------------------------------
            Section 7 - Join Us
        ------------------------------- */}
        <div
          ref={el}
          className="Debug experience-section-7"
          style={{ height: "100vh", width: "100%", zIndex: "1" }}
        >
          <SectionText 
            triggerElement=".experience-section-7"
            backgroundColor="#e6f7ff"
            startPosition="center top"
            endPosition="bottom center"
          >
            <div className="absolute left-[5%] top-[50%] transform -translate-y-1/2 max-w-[500px]">
              
            </div>
          </SectionText>
        </div>
      </div>

      {/* 
        The canvas section that renders our animated model.
        UseCanvas and StickyScrollScene are used to create the sticky scroll effect.
      */}
      <UseCanvas>
        <StickyScrollScene track={el}>
          {(props) => (
            <AnimatedModel {...props} />
          )}
        </StickyScrollScene>
      </UseCanvas>
    </section>
  );
};

const AdvancedApp = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const touchDevice = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        navigator.msMaxTouchPoints > 0;
    setIsTouchDevice(touchDevice);
  }, []);

  return (
    <>
      <GlobalCanvas className='z-10'></GlobalCanvas>
        <SmoothScrollbar>
          {(bind) => (
            <article {...bind}>
              {isTouchDevice && (
                  <p className='sticky t-6 left-6 z-5 p-4 rounded text-white' style={{background: 'rgba(255, 0, 0, 0.7)'}}>
                    WARNING: Touch device detected, performance may vary
                  </p>
              )}
              
              
              <StickySection />
            </article>
          )}
        </SmoothScrollbar>  
      
    </>
  );
};

export default AdvancedApp;