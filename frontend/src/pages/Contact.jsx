import React from 'react';
import NavBar2 from "../components/layout/NavBar2";
import Footer from "../components/layout/Footer";
import Hero from "../assets/images/Contact/Hero.png";

const Contact = () => {
  return (
    <>
      <NavBar2 />
      
      {/* Banner Image Space with increased margin */}
      <div className="w-full h-96 my-16 bg-blue-50">
        <img src={Hero} alt="Banner" className="w-full h-full object-cover" /> 
      </div>
      
      <div className="max-w-3xl mx-auto px-5 mb-16">
        <h1 className="text-2xl font-bold mb-8 pb-3 text-center border-b border-gray-200">
          CONTACT US
        </h1>
        
        <div className="flex flex-col gap-12">
          {/* Email section */}
          <div className="contact-info">
            <p className="text-center text-gray-500 text-sm mb-2">E-MAIL</p>
            <p className="text-center font-medium text-lg">Yadom.official@gmail.com</p>
          </div>
          
          {/* Phone section */}
          <div className="contact-info">
            <p className="text-center text-gray-500 text-sm mb-2">PHONE</p>
            <p className="text-center font-medium text-lg">0982852091</p>
          </div>
          
          {/* Address section */}
          <div className="contact-info">
            <p className="text-center text-gray-500 text-sm mb-2">ADDRESS</p>
            <p className="text-center font-medium text-base max-w-lg mx-auto">
              Rimnam Dormitory, Room 323, Wongsawang Road<br />
              (Soi Wongsawang 11), Wongsawang Subdistrict,<br />
              Bang Sue District, Bangkok 10800, Thailand
            </p>
          </div>
        
        </div>
      </div>
        <Footer />
    </>
  );
};

export default Contact;