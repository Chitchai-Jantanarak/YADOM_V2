import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import NavBar2 from "../components/layout/NavBar2";
import Footer from "../components/layout/Footer";

import FS from "../assets/images/AboutUs/earth.png"
import INHL1 from "../assets/images/AboutUs/inhaler1.jpg"
import INHL2 from "../assets/images/AboutUs/inhaler2.png"
import INHL3 from "../assets/images/AboutUs/inhaler3.jpg"
import INHL4 from "../assets/images/AboutUs/inhaler4.png"

const AboutUs = () => {
  // Setup intersection observer
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  
  // Animation controls
  const backgroundControls = useAnimation();
  const foregroundControls = useAnimation();
  
  // Apply animations when in view
  React.useEffect(() => {
    if (inView) {
      backgroundControls.start({
        scale: 1,
        opacity: 0.5,
        transition: { duration: 1.2, ease: "easeOut" }
      });
      
      foregroundControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 1.2, delay: 0.3, ease: "easeOut" }
      });
    } else {
      backgroundControls.start({
        scale: 1.5,
        opacity: 0,
      });
      
      foregroundControls.start({
        scale: 0.5,
        opacity: 0,
      });
    }
  }, [inView, backgroundControls, foregroundControls]);
  
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
                <h1 className="text-5xl sm:text-6xl md:text-[7rem] lg:text-[9rem] leading-[0.9] font-bold text-gray-800">HEY<br />THERE</h1>
              </div>
              
              {/* Right aligned text - responsive width */}
              <div className="w-full md:w-2/5 pt-4"> 
                <p className="text-xl md:text-2xl font-thin leading-loose"> 
                  We believe that something as essential as breathing should be both effective and uniquely yours. 
                  That's why we created the world's first fully customizable inhalers—so you can breathe easier with a device 
                  that fits your lifestyle, personality, and needs.
                </p>
              </div>
            </div>
            
            {/* Product images in a row - responsive grid */}
            <div className="mt-12 md:mt-24 w-full">
              <div className="flex flex-row w-full justify-center items-center gap-8">
                <div className="flex items-center justify-center flex-1">
                  <img src={INHL3} alt="Inhaler design 1" className="h-48 md:h-60 lg:h-72 object-contain" /> 
                </div>
                <div className="flex items-center justify-center flex-1">
                  <img src={INHL1} alt="Inhaler design 2" className="h-48 md:h-60 lg:h-72 object-contain" /> 
                </div>
                <div className="flex items-center justify-center flex-1">
                  <img src={INHL2} alt="Inhaler design 3" className="h-48 md:h-60 lg:h-72 object-contain" /> 
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* WHY WE EXIST Section - responsive text alignment */}
        <section className="py-4 mt-8 md:mt-16">
          <div className="container mx-auto px-4">
            <div className="border-t border-gray-300 mb-8 md:mb-16"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-left md:text-right mb-4 md:mb-8">WHY WE EXIST</h2>
            <div className="flex justify-start md:justify-end">
              <p className="w-full md:w-1/2 text-left md:text-right text-xl md:text-2xl leading-loose"> 
                Let's be real—traditional inhalers? Pretty boring. We wanted to change that. Whether you want a sleek, 
                modern design, a pop of color, or even a tech-savvy smart inhaler, we've got you covered. Because managing asthma or other 
                respiratory conditions shouldn't mean sacrificing style, comfort, or innovation.
              </p>
            </div>
            <div className="border-b border-gray-300 mt-8 md:mt-16"></div>
          </div>
        </section>

      
        {/* BREATHING REVOLUTION Section with Zoom Effects - made responsive */}
        <section className="py-1 overflow-hidden my-6 md:my-12" ref={ref}>
          <div className="container mx-auto px-4">
            <div className="relative flex justify-center items-center h-40 sm:h-48 md:h-64">
              {/* Background faded text with zoom animation - Increased text size */}
              <motion.div 
                className="absolute text-[#c7d0f7] text-opacity-50 font-bold text-6xl sm:text-8xl md:text-[10rem] tracking-wide text-center"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={backgroundControls}
              >
                JOIN THE<br />REVOLUTION
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
                  scale: [0.8, 1.1, 0.8] 
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3, 
                  ease: "easeInOut" 
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
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Text column */}
              <div className="w-full md:w-3/4 text-xl md:text-2xl lg:text-3xl leading-relaxed text-gray-700">
                At Yadomm, we believe that self-care should go hand in hand with caring for the planet.
                That's why we are committed to using eco-friendly, recyclable packaging materials and minimizing waste in every step of our process.
                Our inhalers are designed not only to refresh your senses, but also to reflect a mindful lifestyle that values sustainability, simplicity, and responsibility.
                Because taking a deep breath should never come at the cost of the Earth.
              </div>

              {/* Earth image (centered) */}
              <div className="w-full md:w-1/4 flex justify-center">
                <img
                  src={FS}
                  alt="Earth"
                  className="w-32 md:w-48 lg:w-64 h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Use imported Footer component */}
      <Footer carousel='true'/>
    </div>
  );
};

export default AboutUs;