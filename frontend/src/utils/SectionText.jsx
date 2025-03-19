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
    
    // Timeline for background color changes
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: startPosition,
        end: endPosition,
        scrub: 1,
        toggleActions: "play", 
        onEnter: () => {
          if (backgroundColor) {
            gsap.to(document.body, {
              backgroundColor: backgroundColor,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        },
        onEnterBack: () => {
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
    
    // Separate timeline for opacity animation
    const t2 = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "75% top",
        end: "bottop top",
        scrub: 1,
      }
    });
    
    t2.to(containerRef.current, {
      opacity: 0,

    });
    
    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      if (t2.scrollTrigger) {
        t2.scrollTrigger.kill();
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