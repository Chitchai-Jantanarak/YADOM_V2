import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFrame, extend, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { a, config, useSpring } from '@react-spring/three';
import { GlobalCanvas, useCanvas, SmoothScrollbar, UseCanvas } from '@14islands/r3f-scroll-rig';
import { StickyScrollScene } from '@14islands/r3f-scroll-rig/powerups';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AmbientLight } from 'three';

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
  const innerModelLRef = useRef();
  const innerModelRRef = useRef();

  const { width } = useWindowSize();
  const size = scale.xy.min() * 0.33;

  // Transition effect with GSAP
  useEffect(() => {
    if (!modelRef.current) return; 

    let ctx = gsap.context(() => {
      let t1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".expereince-home-sticky-container",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

      t1.fromTo(
        modelRef.current.position,
        { x: width * 0.2 },
        { x: 0, duration: 1 }
      )
      .to(modelRef.current.rotation, {
        y: Math.PI * 1.15,
        duration: 1
      }, "+=0.5")
      .to(innerModelLRef.current.material, { opacity: 1 });
    });

    return () => ctx.revert();  // Clean up
  }, [width]);

  const spring = useSpring({
    scale: inViewport ? size : 0,
    config: inViewport ? config.wobbly : config.stiff,
    delay: inViewport ? 300 : 0
  });

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <Model ref={modelRef} args={[1, 1, 1, 0.05, 16]} {...spring}>
        <meshStandardMaterial color="#1e88e5" />
      </Model>
      <Model ref={innerModelLRef} args={[1, 1, 1, 0.05, 16]} {...spring}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
      <Model ref={innerModelRRef} args={[1, 1, 1, 0.05, 16]} {...spring}>
        <meshStandardMaterial color="#FFF" transparent opacity={0} />
      </Model>
    </>
  );
};

function StickySection() {
  const el = useRef();
  
  return (
    <section>
      <div className='expereince-home-sticky-container'>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%' }}>
          
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
}

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
      <GlobalCanvas className='-z-10'></GlobalCanvas>
        <SmoothScrollbar>
          {(bind) => (
            <article {...bind}>
              {isTouchDevice && (
                  <p className='fixed t-6 left-6 z-5 p-4 rounded text-white' style={{background: 'rgba(255, 0, 0, 0.7)'}}>
                    WARNING: Touch device detected, performance may vary
                  </p>
              )}
              
              
              <StickySection />
              <article className='absolute my-12 inline-block top-[10%]'>
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


// const AdvancedApp = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const containerRef = useRef(null);
  
//   useEffect(() => {
//     const lenis = new Lenis({
//       duration: 1.2,
//       easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       direction: 'vertical',
//       gestureDirection: 'vertical',
//       smooth: true,
//       mouseMultiplier: 1,
//       smoothTouch: false,
//       touchMultiplier: 2,
//       infinite: false,
//     });

//     function raf(time) {
//       lenis.raf(time);
//       requestAnimationFrame(raf);
//     }
    
//     // Capture scroll position for Three.js animations
//     lenis.on('scroll', ({ scroll }) => {
//       setScrollY(scroll);
//     });

//     requestAnimationFrame(raf);

//     // Set up scroll sections with GSAP ScrollTrigger
//     const sections = document.querySelectorAll('.scroll-section');
//     sections.forEach((section, i) => {
//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top top',
//         end: 'bottom top',
//         onEnter: () => console.log(`Entered section ${i+1}`),
//         onLeave: () => console.log(`Left section ${i+1}`),
//       });
//     });

//     return () => {
//       lenis.destroy();
//       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//     };
//   }, []);

//   return (
//     <div ref={containerRef} style={{ position: 'relative' }}>
//       {/* Canvas for 3D content */}
//       <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
//         <Canvas>
//           <Scene scrollY={scrollY} />
//           <color attach="background" args={['#000']} />
//         </Canvas>
//       </div>
      
//       {/* HTML Content with scroll sections */}
//       <div className="content">
//         <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
//           <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
//             Scroll to explore
//           </h1>
//         </section>
        
//         <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
//           <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
//             Watch the model rotate
//           </h1>
//         </section>
        
//         <section className="scroll-section" style={{ height: '100vh', position: 'relative' }}>
//           <h1 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontSize: '2em' }}>
//             See the split effect
//           </h1>
//         </section>
//       </div>
//     </div>
//   );
// };

// // 3D Scene Component
// const Scene = ({ scrollY }) => {
//   const { viewport } = useThree();
  
//   // References to 3D objects
//   const modelRef = useRef(); // Single model reference for page 1-2
//   const page3LeftRef = useRef();
//   const page3RightRef = useRef();
  
//   // Animation timelines
//   const tl1 = useRef();
//   const tl2 = useRef();
//   const tl3 = useRef();
  
//   // Set up GSAP animations on mount
//   useEffect(() => {
//     // First page animation - box moves from right to center
//     // Adjusted to start further right (4 instead of 2.5)
//     tl1.current = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".scroll-section:nth-child(1)",
//         start: "top top",
//         end: "bottom top",
//         scrub: 1
//       }
//     });
    
//     tl1.current.fromTo(
//       modelRef.current.position,
//       { x: 4 }, // Starting further right as requested
//       { x: 0, ease: "power2.inOut" }
//     );
    
//     // Second page animation - model rotates
//     tl2.current = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".scroll-section:nth-child(2)",
//         start: "top top",
//         end: "bottom top",
//         scrub: 1
//       }
//     });
    
//     tl2.current.to(
//       modelRef.current.rotation,
//       { y: Math.PI * 2, ease: "none" }
//     );
    
//     // Third page animation - rectangles split horizontally from the center model
//     tl3.current = gsap.timeline({
//       scrollTrigger: {
//         trigger: ".scroll-section:nth-child(3)",
//         start: "top top",
//         end: "bottom top",
//         scrub: 1
//       }
//     });
    
//     // Move left rectangle directly to the left (no y change)
//     tl3.current.to(
//       page3LeftRef.current.position,
//       { x: -4, ease: "power2.out" },
//       0
//     );
    
//     // Move right rectangle directly to the right (no y change)
//     tl3.current.to(
//       page3RightRef.current.position,
//       { x: 4, ease: "power2.out" },
//       0
//     );
    
//     // Rotate the planes for visual interest
//     tl3.current.to(
//       page3LeftRef.current.rotation,
//       { z: Math.PI / 8, ease: "power2.out" }, // Slight rotation
//       0
//     );
    
//     tl3.current.to(
//       page3RightRef.current.rotation,
//       { z: -Math.PI / 8, ease: "power2.out" }, // Slight rotation in opposite direction
//       0
//     );
    
//     tl3.current.to(
//       page3LeftRef.current.material,
//       { opacity: 1, ease: "power1.inOut" },
//       0
//     );
    
//     tl3.current.to(
//       page3RightRef.current.material,
//       { opacity: 1, ease: "power1.inOut" },
//       0
//     );
    
//     return () => {
//       // Clean up timelines
//       if (tl1.current) tl1.current.kill();
//       if (tl2.current) tl2.current.kill();
//       if (tl3.current) tl3.current.kill();
//     };
//   }, []);
  
//   return (
//     <>
//       {/* Single model for both Page 1 and 2: Box that moves from right to center, then rotates */}
//       <mesh ref={modelRef} position={[4, 0, 0]}>
//         <boxGeometry args={[1, 1, 1]} />
//         <meshStandardMaterial color="hotpink" />
//       </mesh>
      
//       {/* Page 3: Rectangles that split horizontally from the center */}
//       <mesh ref={page3LeftRef} position={[0, 0, -1]}>
//         <planeGeometry args={[2, 3]} />
//         <meshStandardMaterial color="cyan" transparent opacity={0} side={THREE.DoubleSide} />
//       </mesh>
      
//       <mesh ref={page3RightRef} position={[0, 0, -1]}>
//         <planeGeometry args={[2, 3]} />
//         <meshStandardMaterial color="orange" transparent opacity={0} side={THREE.DoubleSide} />
//       </mesh>
      
//       {/* Lighting */}
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} intensity={1} />
//     </>
//   );
// };

// // Custom hook to easily access window size in Three.js


export default AdvancedApp;