import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Components
import Logo from '../ui/Logo';
import Arrow from '../ui/Arrow';

const NavBar = () => {

    // const toggleMenu = () => {
    //     setIsMenuOpen(prevState => !prevState);
    // };

    const menuItems = [
        { name: 'PRODUCT',  Link: '/product',   subHead: true,  subHeading: ['PRODUCT 1', 'Product 2', 'Product 3'] },
        { name: 'ABOUT',    Link: '/about',     subHead: true,  subHeading: ['About 1', 'About 2', 'About 3'] },
        { name: 'CONTACT',  Link: '/contact',   subHead: false}
    ]

    const handleLinkClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // setIsMenuOpen(false);
    };
    
    return (
        <div className="nav sticky top-0 z-40 ">
            <div className="flex justify-between bg-white items-center shadow-lg outline outline-black/5">

                {/* Section - L */}
                <div className='flex items-center space-x-12'>

                    {/* Logo */}
                    <Link className='ml-5 max-md:m-4 transition-all duration-300' to={'/'} onClick={handleLinkClick}>
                        <Logo />
                    </Link>
                    
                    <nav className='hidden md:block'>
                        <ul className='flex relative space-x-4 tracking-widest '>
                            { menuItems.map((item, index) => (
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

                {/* Section - R */}
                <div className='flex items-center space-x-12'>
                </div>

            </div>
        </div>
    );
}

export default NavBar;