import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"

const CarouselCard = ({ images }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          // When window width is >= 640px
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // When window width is >= 768px
          768: {
            slidesPerView: Math.min(4, images.length),
            spaceBetween: 30,
          },
        }}
        modules={[Autoplay]}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="h-full">
            <div className="flex justify-center items-center h-full p-2">
              <div className="w-full h-full aspect-square overflow-hidden rounded-md">
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-contain" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CarouselCard

