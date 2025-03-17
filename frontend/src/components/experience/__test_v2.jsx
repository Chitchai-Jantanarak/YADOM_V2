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
import Model1 from '../models/Model1';
import Arrow from '../ui/Arrow';


gsap.registerPlugin(ScrollTrigger);

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  const { viewport } = useThree();
  
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return {
    width: size[0],
    height: size[1],
    aspect: size[0] / size[1],
    viewport
  };
};

const Model = a(RoundedBox); // Add spring capability to RoundedBox

const AnimatedModel = ({ scale, scrollState, inViewport }) => {
  const modelRef = useRef();
  const materialRef = useRef();
  const innerModelLRef = useRef();
  const innerModelRRef = useRef();

  const { width } = useWindowSize();
  const size = scale.xy.min() * 0.33;
  const sizeInner = scale.xy.min() * 0.17;

  // Timeline references ** Split as section to implemented 1:1
  const tl = useRef();
  const t2 = useRef();
  const t3 = useRef();
  const t4 = useRef();
  const t5 = useRef();
  const t6 = useRef();
  const t7 = useRef();
  const tlRotation = useRef();
  const tlColor3 = useRef();
  const tlColor4 = useRef();
  const tlColor5 = useRef();
  const tlSplit = useRef();

  // Create color refs to track current colors
  const colorBlue = useRef(new THREE.Color("#1e88e5"));
  const colorRed = useRef(new THREE.Color("#e53935"));
  const colorGreen = useRef(new THREE.Color("#43a047"));
  const colorPurple = useRef(new THREE.Color("#8e24aa"));

  // Transition effect with GSAP
  useEffect(() => {
    if (!(modelRef.current && materialRef.current && innerModelLRef.current && innerModelRRef.current)) return;

    // Section 1: Transition to center
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-2",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });
    
    tl.current.fromTo(
      modelRef.current.position,
      { x: width * 0.2 },
      { x: 0, ease: "power2.inOut" }
    );

    (t2.current, t3.current, t4.current)

    // Sections 2-5: Rotation (throughout these sections)
    tlRotation.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".Scroll",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });
    
    tlRotation.current.to(
      modelRef.current.rotation,
      { y: Math.PI * 2, ease: "linear" }
    );
    
    // For color animations, use a simple approach with onUpdate
    
    // Section 3: Change color to red
    tlColor3.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-3",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });
    
    const initialColor3 = materialRef.current.color.clone();
    tlColor3.current.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = tlColor3.current.progress();
        materialRef.current.color.r = initialColor3.r + (colorRed.current.r - initialColor3.r) * progress;
        materialRef.current.color.g = initialColor3.g + (colorRed.current.g - initialColor3.g) * progress;
        materialRef.current.color.b = initialColor3.b + (colorRed.current.b - initialColor3.b) * progress;
      }
    });
    
    // Section 4: Change color to green
    tlColor4.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-4",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    tlColor4.current.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = tlColor4.current.progress();
        materialRef.current.color.r = colorRed.current.r + (colorGreen.current.r - colorRed.current.r) * progress;
        materialRef.current.color.g = colorRed.current.g + (colorGreen.current.g - colorRed.current.g) * progress;
        materialRef.current.color.b = colorRed.current.b + (colorGreen.current.b - colorRed.current.b) * progress;
      }
    });
    
    // Section 5: Change color to purple
    tlColor5.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-5",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    tlColor5.current.to({}, {
      duration: 1,
      onUpdate: function() {
        const progress = tlColor5.current.progress();
        materialRef.current.color.r = colorGreen.current.r + (colorPurple.current.r - colorGreen.current.r) * progress;
        materialRef.current.color.g = colorGreen.current.g + (colorPurple.current.g - colorGreen.current.g) * progress;
        materialRef.current.color.b = colorGreen.current.b + (colorPurple.current.b - colorGreen.current.b) * progress;
      }
    });
    
    // Section 6: Split and set opacity of sub-models
    tlSplit.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".experience-section-6",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });
    
    // Move and rotate left inner model
    tlSplit.current.to(
      innerModelLRef.current.position,
      { x: -sizeInner, ease: "power2.out" },
      0
    );
    
    tlSplit.current.to(
      innerModelLRef.current.rotation,
      { z: Math.PI / 8, ease: "power2.out" },
      0
    );
    
    tlSplit.current.to(
      innerModelLRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    // Move and rotate right inner model
    tlSplit.current.to(
      innerModelRRef.current.position,
      { x: sizeInner, ease: "power2.out" },
      0
    );
    
    tlSplit.current.to(
      innerModelRRef.current.rotation,
      { z: -Math.PI / 8, ease: "power2.out" }, 
      0
    );
    
    tlSplit.current.to(
      innerModelRRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    return () => {
      // Clean up all timelines
      if (tl.current) tl.current.kill();
      if (tlRotation.current) tlRotation.current.kill();
      if (tlColor3.current) tlColor3.current.kill();
      if (tlColor4.current) tlColor4.current.kill();
      if (tlColor5.current) tlColor5.current.kill();
      if (tlSplit.current) tlSplit.current.kill();
    };
  }, [width, sizeInner]);

  const springMain = useSpring({
    scale: inViewport ? size : 0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 300 : 0
  });

  const springInner = useSpring({
    scale: inViewport ? sizeInner : 0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 300 : 0
  });

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <PerspectiveCamera >
      <Model ref={modelRef} args={[1, 1, 1, 0.05, 16]} {...springMain}>
        <meshStandardMaterial ref={materialRef} color={colorBlue.current} />
      </Model>
      <Model ref={innerModelLRef} args={[1, 1, 1, 0.05, 16]} {...springInner}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
      <Model ref={innerModelRRef} args={[1, 1, 1, 0.05, 16]} {...springInner}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
      {/* <Model1 ref={modelRef} {...springMain}/>
      <Model1 ref={innerModelLRef} {...springInner}/>
      <Model1 ref={innerModelRRef} {...springInner}/> */}
      </PerspectiveCamera>
    </>
  );
};

const StickySection = () => {
  const el = useRef();
  const containerRef = useRef(null);

  useEffect(() => {
    // Set initial background color
    document.body.style.backgroundColor = "#ffffff";
    
    // Create a global ScrollTrigger for debugging
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      markers: false
    });
    
    return () => {
      // Reset background color on unmount
      document.body.style.backgroundColor = "";
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section ref={containerRef}>
      <div className='experience-home-sticky-container relative'>
        {/* Section 1 - Refresh Your Feeling */}
        <div ref={el} className='Debug experience-section-1' style={{ height: '100vh', width: '100%', zIndex: '10' }}>
          <SectionText 
            triggerElement=".experience-section-1" 
            backgroundColor="#ffffff" 
            startPosition="30% top"
            endPosition="bottom top"
          >
            <div className="absolute left-[5%] top-[30%] transform translate-y-[-50%] max-w-[60%] space-y-10">
              <div className='space-y-6'>
                <article className="flex items-center space-x-2">
                  <h2 className="max-md:text-3xl text-7xl font-bold font-archivo uppercase">REFRESH</h2>
                  <span className="max-md:text-2xl text-6xl font-zentokyozoo">YOUR FEELING</span>
                </article>
                <h2 className="max-md:text-2xl text-6xl font-zentokyozoo mb-4 uppercase">WITH YOUR OWN STYLE</h2>
              </div>
              <p>
                Begin design your own yadom now!
              </p>

              <button className="mt-4 px-6 py-2 text-white bg-sky-300 rounded-full flex items-center gap-2 group shadow-md">
                <h5 className='text-white'>Customize</h5>
                <Arrow/>
              </button>
            </div>
          </SectionText>
        </div>

        {/* Section 2 - Pocket-sized Freshness */}
        <div ref={el} className='Debug experience-section-2' style={{ height: '100vh', width: '100%', zIndex: '10' }}>
            <SectionText 
              triggerElement=".experience-section-2"
              backgroundColor="#f0f8ff"
              startPosition="30% top"
              endPosition="bottom top"
            >
              <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px]">
                <article className="inline-block items-center space-y-4 my-2">
                  <h2 className="max-md:text-2xl text-6xl font-bold font-archivo uppercase">POCKET-SIZED</h2>
                  <h2 className="max-md:text-2xl text-6xl font-bold font-archivo uppercase">FRESHNESS</h2>
                  <h2 className="max-md:text-2xl text-6xl font-bold font-archivo uppercase">FOR EVERY</h2>
                  <h2 className="max-md:text-2xl text-6xl font-bold font-archivo uppercase">MOMENT</h2>
                </article>

                <p>Keep Yadomm in your pocket. Let’s be <br />the essence for your every day life</p>
              </div>
            </SectionText>
          </div>

        <div className='Scroll'>
          {/* Section 3 - Say Goodbye */}
          <div ref={el} className='Debug experience-section-3' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
            <SectionText 
              triggerElement=".experience-section-3"
              backgroundColor="#000000"
              startPosition="top top"
              endPosition="bottom top"
            >
              <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px] text-white">
                <h2 className="text-4xl font-bold mb-2 uppercase">SAY GOODBYE TO</h2>
                <h3 className="text-2xl font-medium mb-4 uppercase">BAD FEELINGS</h3>
                <h2 className="text-4xl font-bold mb-2 uppercase">SAY HELLO TO</h2>
                <h3 className="text-2xl font-medium mb-4 uppercase">FRESHNESS</h3>
              </div>
            </SectionText>
          </div>

          {/* Section 4 - Customize Your Inhaler */}
          <div ref={el} className='Debug experience-section-4' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
            <SectionText 
              triggerElement=".experience-section-4"
              backgroundColor="#bbbdff"
              startPosition="top top"
              endPosition="bottom top"
            >
              <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px]">
                <h2 className="text-4xl font-bold mb-2 uppercase">CUSTOMIZE YOUR</h2>
                <h3 className="text-2xl font-medium mb-4 uppercase">INHALER</h3>
                <div className="mt-4">
                  <p className="text-sm mb-1">Choose your component:</p>
                  <p className="text-sm mb-1">1. Fresh</p>
                  <p className="text-sm mb-1">2. Calm</p>
                  <p className="text-sm mb-1">3. Focus</p>
                </div>
              </div>
            </SectionText>
          </div>

          {/* Section 5 - Customize Your Feelings */}
          <div ref={el} className='Debug experience-section-5' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
            <SectionText 
              triggerElement=".experience-section-5"
              backgroundColor="#d5f2e3"
              startPosition="top top"
              endPosition="bottom top"
            >
              <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px]">
                <h2 className="text-4xl font-bold mb-2 uppercase">CUSTOMIZE YOUR</h2>
                <h3 className="text-2xl font-medium mb-4 uppercase">FEELINGS</h3>
                <div className="mt-4">
                  <p className="text-sm mb-1">We have so many aromas from all over the world:</p>
                  <p className="text-sm mb-1">1. Lavender</p>
                  <p className="text-sm mb-1">2. Eucalyptus</p>
                  <p className="text-sm mb-1">3. Minty</p>
                </div>
              </div>
            </SectionText>
          </div>
        </div>

        {/* Additional sections with their own background colors */}
        <div ref={el} className='Debug experience-section-6' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <SectionText 
            triggerElement=".experience-section-6"
            backgroundColor="#f5f5f5"
            startPosition="top top"
            endPosition="bottom top"
          >
            <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px]">
              <h2 className="text-4xl font-bold mb-2 uppercase">EXPERIENCE</h2>
              <h3 className="text-2xl font-medium mb-4 uppercase">THE DIFFERENCE</h3>
              <p className="text-base leading-relaxed max-w-[400px]">
                Transform your daily routine with our revolutionary product.
              </p>
            </div>
          </SectionText>
        </div>

        <div ref={el} className='Debug experience-section-7' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <SectionText 
            triggerElement=".experience-section-7"
            backgroundColor="#e6f7ff"
            startPosition="top top"
            endPosition="bottom top"
          >
            <div className="absolute left-[10%] top-[50%] transform translate-y-[-50%] max-w-[500px]">
              <h2 className="text-4xl font-bold mb-2 uppercase">JOIN US</h2>
              <h3 className="text-2xl font-medium mb-4 uppercase">ON THIS JOURNEY</h3>
              <p className="text-base leading-relaxed max-w-[400px]">
                Be part of our community and discover new possibilities.
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-200 text-blue-800 rounded-full">
                Subscribe
              </button>
            </div>
          </SectionText>
        </div>
      </div>
      
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