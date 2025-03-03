import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const CarouselImage = ({ images }) => {
  return (
    <div className="carousel-container">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className='mySwiper'
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image.src} alt={image.alt} className='w-full object-contain' />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Optional: You can add other custom styles or features here */}
    </div>
  );
};

export default CarouselImage;
