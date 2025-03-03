import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const CarouselImage = ({ images }) => {
  return (
    <div className="w-full h-full relative">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet custom-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active'
        }}
        modules={[Autoplay, Pagination]}
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

export default CarouselImage;