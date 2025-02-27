import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
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
  const innerModelLRef = useRef();
  const innerModelRRef = useRef();

  const { width } = useWindowSize();
  const size = scale.xy.min() * 0.33;
  const sizeInner = scale.xy.min() * 0.17;

  const tl1 = useRef();
  const tl2 = useRef();
  const tl3 = useRef();

  // Transition effect with GSAP
  useEffect(() => {
    if (!(modelRef.current && innerModelLRef.current && innerModelRRef.current)) return;

    // tl1 init
    tl1.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".expereince-home-sticky-container .Debug:nth-child(1)",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    });
    
    tl1.current.fromTo(
      modelRef.current.position,
      { x: width * 0.2 },
      { x: 0, ease: "power2.inOut" }
    );

    // tl2 init
    tl2.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".expereince-home-sticky-container .Debug:nth-child(2)",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        markers: 1
      }
    });
    
    tl2.current.to(
      modelRef.current.rotation,
      { y: Math.PI * 2, ease: "none" }
    );
    
    // tl3 init
    tl3.current = gsap.timeline({
      scrollTrigger: {
        trigger: ".expereince-home-sticky-container .Debug:nth-last-child(2)",
        start: "top top",
        end: "top bottom",
        scrub: 1,
        markers: 1
      }
    });
    
    tl3.current.to(
      innerModelLRef.current.position,
      { x: -sizeInner, ease: "power2.out" },
      0
    );
    
    tl3.current.to(
      innerModelRRef.current.position,
      { x: sizeInner, ease: "power2.out" },
      0
    );
    
    tl3.current.to(
      innerModelLRef.current.rotation,
      { z: Math.PI / 8, ease: "power2.out" },
      0
    );
    
    tl3.current.to(
      innerModelRRef.current.rotation,
      { z: -Math.PI / 8, ease: "power2.out" }, 
      0
    );
    
    tl3.current.to(
      innerModelLRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    tl3.current.to(
      innerModelRRef.current.material,
      { opacity: 1, ease: "power1.inOut" },
      0
    );
    
    return () => {
      // Clean up timelines
      if (tl1.current) tl1.current.kill();
      if (tl2.current) tl2.current.kill();
      if (tl3.current) tl3.current.kill();
    };
  }, [width]);

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
        <meshStandardMaterial color="#1e88e5" />
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
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
        </div>
        <div ref={el} className='Debug' style={{ height: '100vh', width: '100%', zIndex: '1' }}>
          <p>test</p>
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
              <article className='absolute my-12 inline-block top-[10%] z-20'>
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