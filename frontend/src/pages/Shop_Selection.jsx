import React from 'react';
import NavBar from '../components/layout/NavBar';
import TextCarousel from '../components/ui/TextCarousel';
import Footer from '../components/layout/Footer';

export default function Shop_Selection() {
    return (
        <div className='shopselection'>
            <NavBar />
            <header className='min-h-lvh relative block justify-center items-center'>
                <div>
                    <img 
                        src='https://picsum.photos/200/300?grayscale'
                        alt="Shop Background" 
                        className="w-full h-full object-cover absolute inset-0 bg-transparent" 
                    />
                </div>
            </header>
            <TextCarousel text='yadomm' />
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

            <Footer />
        </div>
    );
}
