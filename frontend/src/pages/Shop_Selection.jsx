import React, { useEffect } from 'react';
import Lenis from 'lenis';

import PageTransition from '../components/layout/PageTransition';
import CarouselImage from '../components/ui/CarouselImage';
import NavBar2 from '../components/layout/NavBar2';
import TextCarousel from '../components/ui/TextCarousel';
import Footer from '../components/layout/Footer';

const Shop_Selection = () => {

    const images = [{ src: 'https://placehold.co/600x400', alt: 'Image 1' },
    { src: 'https://placehold.co/400x400', alt: 'Image 2' },
    { src: 'https://placehold.co/200x200', alt: 'Image 3' },
    { src: 'https://placehold.co/800x800', alt: 'Image 4' },];

    // Initialize Lenis
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
        
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div className='shopselection'>
            <div className='mx-[5%]'>
                <NavBar2 />
            </div>
            <header className='max-h-[70vh] relative block justify-center overflow-hidden items-center mx-14 border-2 border-black'>
                <CarouselImage images={images} />
            </header>



            <div className='mx-[5%]'>
                <header className='font-archivo font-black text-3xl'> SPOTLIGHT </header>
                <section className='h-80 flex bg-gray-100'>
                    <div className="container mx-auto py-10 px-24 grid sm:grid-cols-2">
                            <div>
                                <h2 className="text-xl mb-4">Topic 1</h2>
                                <p>Content for Topic 1...</p>
                            </div>
                            <div className=''>
                                test
                            </div>
                    </div>
                </section>

                <section className='h-80 bg-gray-200'>
                    <div className="container mx-auto p-24">
                        <h2 className="text-xl mb-4">Topic 2</h2>
                        <p>Content for Topic 2...</p>
                    </div>
                </section>

                <section className='h-80 bg-gray-300'>
                    <div className="container mx-auto p-24">
                        <h2 className="text-xl mb-4">Topic 3</h2>
                        <p>Content for Topic 3...</p>
                    </div>
                </section>

                <Footer carousel='true' />
            </div>
            
        </div>
    );
}

export default PageTransition(Shop_Selection);