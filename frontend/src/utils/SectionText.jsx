import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Make sure to register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const SectionText = ({ 
  children, 
  triggerElement, 
  startPosition = "top top", 
  endPosition = "center top",
  backgroundColor = null 
}) => {
  const containerRef = useRef();
  
  useEffect(() => {
    // Make sure component is mounted and trigger element exists
    if (!containerRef.current) return;
    
    // Find the trigger element
    const trigger = document.querySelector(triggerElement);
    if (!trigger) {
      console.warn(`Trigger element ${triggerElement} not found`);
      return;
    }
    
    // Set initial opacity to 1
    gsap.set(containerRef.current, { opacity: 1 });
    
    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: startPosition,
        end: endPosition,
        scrub: 1,
        markers: true, // For debugging
        toggleActions: "play", // Important for bidirectional control
        onEnter: () => {
          // Change background when entering from top
          if (backgroundColor) {
            gsap.to(document.body, {
              backgroundColor: backgroundColor,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        },
        onEnterBack: () => {
          // Change background when entering from bottom (scrolling up)
          if (backgroundColor) {
            gsap.to(document.body, {
              backgroundColor: backgroundColor,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        }
      }
    });
    
    // Text fade animation
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, [triggerElement, startPosition, endPosition, backgroundColor]);
  
  return (
    <div ref={containerRef} style={{ opacity: 1 }}>
      {children}
    </div>
  );
};

export default SectionText;