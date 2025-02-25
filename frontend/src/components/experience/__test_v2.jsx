import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Main App Component
const AdvancedApp = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);
  
  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
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
    
    // Capture scroll position for Three.js animations
    lenis.on('scroll', ({ scroll }) => {
      setScrollY(scroll);
    });

    requestAnimationFrame(raf);

    // Set up scroll sections with GSAP ScrollTrigger
    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => console.log(`Entered section ${i+1}`),
        onLeave: () => console.log(`Left section ${i+1}`),
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Canvas for 3D content */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <Canvas>
          <Scene scrollY={scrollY} />
          <color attach="background" args={['#000']} />
        </Canvas>
      </div>
      
      {/* HTML Content with scroll sections */}
      <div className="content">
        <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
          <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
            Scroll to explore
          </h1>
        </section>
        
        <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
          <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
            Watch the model rotate
          </h1>
        </section>
        
        <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
          <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
            See the split effect
          </h1>
        </section>
      </div>
    </div>
  );
};

// 3D Scene Component
const Scene = ({ scrollY }) => {
  const { viewport } = useThree();
  
  // References to 3D objects
  const modelRef = useRef(); // Single model reference for page 1-2
  const page3LeftRef = useRef();
  const page3RightRef = useRef();
  
  // Animation timelines
  const tl1 = useRef();
  const tl2 = useRef();
  const tl3 = useRef();
  
  // Set up GSAP animations on mount
  useEffect(() => {
    // First page animation - box moves from right to center
    // Adjusted to start further right (4 instead of 2.5)
    tl1.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-section:nth-child(1)",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    tl1.current.fromTo(
      modelRef.current.position,
      { x: 4 }, // Starting further right as requested
      { x: 0, ease: "power2.inOut" }
    );
    
    // Second page animation - model rotates
    tl2.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-section:nth-child(2)",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    tl2.current.to(
      modelRef.current.rotation,
      { y: Math.PI * 2, ease: "none" }
    );
    
    // Third page animation - rectangles split horizontally from the center model
    tl3.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-section:nth-child(3)",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
    
    // Move left rectangle directly to the left (no y change)
    tl3.current.to(
      page3LeftRef.current.position,
      { x: -4, ease: "power2.out" },
      0
    );
    
    // Move right rectangle directly to the right (no y change)
    tl3.current.to(
      page3RightRef.current.position,
      { x: 4, ease: "power2.out" },
      0
    );
    
    // Rotate the planes for visual interest
    tl3.current.to(
      page3LeftRef.current.rotation,
      { z: Math.PI / 8, ease: "power2.out" }, // Slight rotation
      0
    );
    
    tl3.current.to(
      page3RightRef.current.rotation,
      { z: -Math.PI / 8, ease: "power2.out" }, // Slight rotation in opposite direction
      0
    );
    
    tl3.current.to(
      page3LeftRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    tl3.current.to(
      page3RightRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    return () => {
      // Clean up timelines
      if (tl1.current) tl1.current.kill();
      if (tl2.current) tl2.current.kill();
      if (tl3.current) tl3.current.kill();
    };
  }, []);
  
  return (
    <>
      {/* Single model for both Page 1 and 2: Box that moves from right to center, then rotates */}
      <mesh ref={modelRef} position={[4, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* Page 3: Rectangles that split horizontally from the center */}
      <mesh ref={page3LeftRef} position={[0, 0, -1]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="cyan" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh ref={page3RightRef} position={[0, 0, -1]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="orange" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </>
  );
};

// Custom hook to easily access window size in Three.js
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

export default AdvancedApp;