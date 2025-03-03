import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CarouselCard = ({ images }) => {
    return (
      <div className="w-full h-full relative">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="w-full h-full flex justify-center items-center">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };
  
  export default CarouselCard;