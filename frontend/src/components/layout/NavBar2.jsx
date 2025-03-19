import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Arrow from '../ui/Arrow';
import Logo from '../ui/Logo';

const NavBar2 = () => {
    // State for navbar visibility
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollTimer, setScrollTimer] = useState(null);

    const menuItems = [
        { name: 'PRODUCT',  Link: '/product',   subHead: true,  subHeading: ['PRODUCT 1', 'Product 2', 'Product 3'] },
        { name: 'ABOUT',    Link: '/about',     subHead: true,  subHeading: ['About 1', 'About 2', 'About 3'] },
        { name: 'CONTACT',  Link: '/contact',   subHead: false},
        { name: 'CART',     Link: '/cart',   subHead: false},
        { name: 'LOGIN',    Link: '/starter',   subHead: false}
    ];

    const menuItemsLeft = menuItems.filter(item => item.subHead);
    const menuItemsRight = menuItems.filter(item => !item.subHead);

    // Handle scroll behavior for navbar
    useEffect(() => {
        let timer;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (timer) {
                clearTimeout(timer);
            }
            
            if (currentScrollY > lastScrollY && visible && currentScrollY > 100) {
                setVisible(false);
            } 
            else if (currentScrollY < lastScrollY - 10 && !visible) {
                setVisible(true);
            }
            
            timer = setTimeout(() => {
                setVisible(true);
            }, 7000);
            
            setLastScrollY(currentScrollY);
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [lastScrollY, visible]);

    const handleLinkClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return (
        <div 
            className={`nav sticky w-full top-0 z-40 transition-transform duration-300 p-3 ${
                visible ? 'translate-y-0' : '-translate-y-full'
            }`}
            style={{ backgroundColor: 'transparent' }}
        >
            <div className="px-[5%] bg-white rounded-lg">
                <div className="grid grid-cols-3 py-4 justify-between items-center outline-black/5">

                    {/* Section - L */}
                    <div className='flex items-center space-x-12'>
                        <nav className='hidden md:block'>
                            <ul className='flex relative space-x-8 tracking-widest '>
                                { menuItemsLeft.map((item, index) => (
                                    <li key={index} className='flex items-center px-2 py-6 border-transparent group transition-all duration-300 group-hover:shadow-xl hover:shadow-2xl'>
                                        <Link to={item.Link} className="capitalize p-1 group-hover:text-tertiary" onClick={handleLinkClick}>
                                            {item.name}
                                        </Link>
                                        {item.subHead && <Arrow />}

                                        {item.subHead && item.subHeading.length > 0 && (
                                            <div className="absolute top-full border-t-2 border-black/5 -mx-2 bg-white shadow-lg p-4 space-y-2 hidden group-hover:block transition-none duration-300">
                                                {item.subHeading.map((sub, idx) => (
                                                    <p key={idx} className="text-sm p-4 text-black">
                                                        {sub}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Section - M */}
                    {/* Logo */}
                    <Link className='flex h-full w-full items-center justify-center transition-all duration-300' to={'/'} onClick={handleLinkClick}>
                        <Logo />
                    </Link>
                    

                    {/* Section - R */}
                    <div className='flex justify-end items-center space-x-12'>
                        <nav className='hidden md:block'>
                            <ul className='flex relative space-x-8 tracking-widest '>
                                { menuItemsRight.map((item, index) => (
                                    <li key={index} className='flex items-center px-2 py-6 border-transparent group transition-all duration-300 group-hover:shadow-xl hover:shadow-2xl'>
                                        <Link to={item.Link} className="capitalize p-1 group-hover:text-tertiary" onClick={handleLinkClick}>
                                            {item.name}
                                        </Link>
                                        {item.subHead && <Arrow />}

                                        {item.subHead && item.subHeading.length > 0 && (
                                            <div className="absolute top-full border-t-2 border-black/5 -mx-2 bg-white shadow-lg p-4 space-y-2 hidden group-hover:block transition-none duration-300">
                                                {item.subHeading.map((sub, idx) => (
                                                    <p key={idx} className="text-sm p-4 text-black">
                                                        {sub}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar2;