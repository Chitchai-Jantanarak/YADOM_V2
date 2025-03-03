import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import NavBar2 from '../components/layout/NavBar2';
import Underline from '../components/ui/Underline';
import TextCarousel from '../components/ui/TextCarousel';
import AdvancedApp from '../components/experience/__test_v2';
import Footer from '../components/layout/Footer';
import Lenis from 'lenis';
import MainLoader from '../components/layout/MainLoader';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      window.location.reload();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
          }, 300); // Shortened delay
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Initialize smooth scrolling with Lenis once loading is complete
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [isLoading]);

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
            <div className='Home mx-[5%]'>
              <NavBar2 />
              <br />
              <Underline />
              
              <section className='expereince-home-sticky-section'>
                <AdvancedApp />
                <p>END SECTION</p>
              </section>

              <section className='h-lvh'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem architecto rerum delectus non quisquam ipsa, laborum id omnis quasi quibusdam eveniet? Ab quia illo veritatis ullam asperiores neque consequatur quos ut veniam sed ratione debitis, quis doloremque ducimus voluptatibus unde aut dolore praesentium cum laudantium eligendi dolorem a perferendis? Nemo quae rem corporis earum eum autem sapiente aut quo in, veritatis ipsam nobis doloremque nostrum magni culpa hic non corrupti nam vitae quis.
              </section>
              
              <TextCarousel 
                text={['REFRESHING AROMAS', 'GET BOOSTED', 'DON\'T FEEL BAD, FEEL THE STYLE']}
                colorIndex={[2, 1, 3]}
                baseVelocity={5} 
                className="font-anybody"
              />
              
              <TextCarousel 
                text={['REFRESHING AROMAS', 'GET BOOSTED', 'DON\'T FEEL BAD, FEEL THE STYLE']}
                colorIndex={[2, 1, 3]}
                baseVelocity={-5} 
                className="font-anybody"
              />
              
              <section className='h-lvh'>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Earum quasi at asperiores, sunt ducimus sint? Temporibus enim ab praesentium perspiciatis beatae officiis ratione nemo cumque fuga. Sed consectetur non repudiandae a voluptates harum, ipsam rem eum vel facilis ad ab dolorum amet aperiam possimus laboriosam eligendi voluptate ipsa sint ex dicta ducimus labore?
              </section>
              <Footer carousel='true' />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
