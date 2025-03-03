import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Arrow from '../ui/Arrow';
import Logo from '../ui/Logo';
import Underline from '../ui/Underline';

const NavBar2 = () => {

    // const toggleMenu = () => {
    //     setIsMenuOpen(prevState => !prevState);
    // };

    const menuItems = [
        { name: 'PRODUCT',  Link: '/product',   subHead: true,  subHeading: ['PRODUCT 1', 'Product 2', 'Product 3'] },
        { name: 'ABOUT',    Link: '/about',     subHead: true,  subHeading: ['About 1', 'About 2', 'About 3'] },
        { name: 'CONTACT',  Link: '/contact',   subHead: false},
        { name: 'CART',     Link: '/cart',   subHead: false},
        { name: 'LOGIN',    Link: '/starter',   subHead: false}
    ]

    const menuItemsLeft = menuItems.filter(item => item.subHead);
    const menuItemsRight = menuItems.filter(item => !item.subHead);


    const handleLinkClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // setIsMenuOpen(false);
    };
    
    return (
        <div className="nav sticky top-0 z-50">
            <div className="grid grid-cols-3 py-4 justify-between bg-white items-center outline-black/5">

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
    );
}

export default NavBar2;