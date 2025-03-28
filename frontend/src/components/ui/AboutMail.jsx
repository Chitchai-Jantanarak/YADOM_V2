import React from 'react';

const AboutMail = () => {
  return (
    <div className="relative w-64 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Triangle at the top */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-violet-400 flex items-center justify-center">
        <span className="text-xs text-stone-900 font-semibold">
          {'< CLICK HERE TO SEE >'}
        </span>
      </div>
      
      {/* Large X (กากบาท) */}
      <div className="absolute inset-0 top-8 bottom-0 bg-white">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#e0e0e0" strokeWidth="2"/>
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="#e0e0e0" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
};

export default AboutMail;