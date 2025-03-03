import React, { useEffect } from 'react';
import Lenis from 'lenis';

import PageTransition from '../components/layout/PageTransition';
import CarouselImage from '../components/ui/CarouselImage';
import CarouselCard from '../components/ui/CarouselCard';
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
        <div className='shopselection mx-[5%]'>
            <div>
                <NavBar2 />
            </div>
            <header className="max-h-[70vh] h-[70vh] relative flex justify-center items-center my-[5%] overflow-hidden">
                <CarouselImage images={images} />
            </header>

            <div>
                <header className='font-archivo font-black text-3xl'> SPOTLIGHT </header>


                <section className='h-80 flex items-center justify-center bg-gray-100'>
                    <article className="overflow-hidden">
                        <CarouselCard images={images} />
                    </article>
                </section>
                <section className="h-80 bg-gray-200">
    <div className="container mx-auto px-12 py-24 flex justify-around items-center w-full">
        <div>
            <p>test</p>
        </div>
        <div>
            <p>tester</p>
        </div>
        <div>
            <p>testtest</p>    
        </div>
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