import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import { a, config, useSpring } from '@react-spring/three';
import { GlobalCanvas, SmoothScrollbar, UseCanvas } from '@14islands/r3f-scroll-rig';
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  // Timeline references
  const tlTransition = useRef();
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
    tlTransition.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".expereince-home-sticky-container .Debug:nth-child(1)",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    tlTransition.current.fromTo(
      modelRef.current.position,
      { x: width * 0.2 },
      { x: 0, ease: "power2.inOut" }
    );

    // Sections 2-5: Rotation (throughout these sections)
    tlRotation.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".expereince-home-sticky-container .Debug:nth-child(2)",
        start: "top top",
        end: ".expereince-home-sticky-container .Debug:nth-child(5) bottom top",
        scrub: 1
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
        trigger: ".expereince-home-sticky-container .Debug:nth-child(3)",
        start: "top top",
        end: "bottom top",
        scrub: 1
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
        trigger: ".expereince-home-sticky-container .Debug:nth-child(4)",
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
        trigger: ".expereince-home-sticky-container .Debug:nth-child(5)",
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
        trigger: ".expereince-home-sticky-container .Debug:nth-child(6)",
        start: "top top",
        end: "bottom top",
        scrub: 1
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
      if (tlTransition.current) tlTransition.current.kill();
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
      <Model ref={modelRef} args={[1, 1, 1, 0.05, 16]} {...springMain}>
        <meshStandardMaterial ref={materialRef} color={colorBlue.current} />
      </Model>
      <Model ref={innerModelLRef} args={[1, 1, 1, 0.05, 16]} {...springInner}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
      <Model ref={innerModelRRef} args={[1, 1, 1, 0.05, 16]} {...springInner}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
    </>
  );
};

const StickySection = () => {
  const el = useRef();
  
  return (
    <section>
      <div className='expereince-home-sticky-container'>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 1: Move to center</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 2: Rotation</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 3: Red + Rotation</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 4: Green + Rotation</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 5: Purple + Rotation</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 6: Split models</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>Section 7: Unpin</p>
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
                  <p className='fixed t-6 left-6 z-5 p-4 rounded text-white' style={{background: 'rgba(255, 0, 0, 0.7)'}}>
                    WARNING: Touch device detected, performance may vary
                  </p>
              )}
              
              
              <StickySection />
              <article className='absolute my-12 inline-block top-[12.5%] z-20'>
                <header>
                  <h2 className="font-archivo text-[64px]">
                    REFRESH <span className="font-zentokyozoo text-[54px]">YOUR FEELING</span> <br />
                    <span className="font-zentokyozoo text-[54px]">WITH YOUR OWN STYLE</span>
                  </h2>

                  <span className='inline-block py-8 border-b-2 border-b-base-300 text-gray-400 text-[26px]'>
                    Begin design your own yadom now!
                  </span>
                </header>

                <Link to="/" className="block mt-8">
                  <button className="btn btn-outline font-anybody tracking-widest px-12">
                    Customize
                  </button>
                </Link>
              </article>
              
              <section style={{ height: '50vh', padding: '20px' }}>
                <h2>Scroll down to see 3D effects</h2>
                <p>This is a demonstration of React Three Fiber with scroll animations</p>
              </section>
            </article>
          )}
        </SmoothScrollbar>  
      
    </>
  );
};

export default AdvancedApp;