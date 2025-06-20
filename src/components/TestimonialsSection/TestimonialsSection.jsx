
import React from 'react';
import ReviewIllustrationUrl from '../../assets/people.svg'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from'swiper/modules';

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const TestimonialAvatarPlaceholder = () => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mr-0 mb-4 sm:mr-6 sm:mb-0">
    <span className="text-blue-400 text-xs sm:text-sm">&lt;&lt;img&gt;&gt;</span>
  </div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Layanan Lapor-in sangat membantu kami dalam menyampaikan aspirasi dan masalah di lingkungan. Responsnya cepat dan transparan",
      name: "Nabil Al Athaaf",
      avatar: null,
    },
    {
      id: 2,
      quote: "Awalnya ragu, tapi setelah mencoba melaporkan drainase tersumbat, ternyata prosesnya mudah dan ada tindak lanjut. Terima kasih Lapor-in!",
      name: "Desnita Pujiawati",
      avatar: null,
    },
    {
      id: 3,
      quote: "Platform yang inovatif untuk kemajuan Kota Batam. Saya berharap semakin banyak warga yang menggunakan fasilitas ini",
      name: "Ahmad Gymnastiar",
      avatar: null,
    },
    {
      id: 4,
      quote: "Sangat berguna untuk menyampaikan keluhan terkait fasilitas publik. Prosesnya juga tidak ribet.",
      name: "Nur Ramadhani Syaputra",
      avatar: null,
    },
    {
      id: 5,
      quote: "Dengan Lapor-in, suara kita sebagai warga benar-benar didengar. Masalah sampah liar di komplek kami jadi lebih cepat ditangani.",
      name: "Raffy Leksono",
      avatar: null,
    },
    {
      id: 6,
      quote: "Sebagai pemerhati kota, saya melihat Lapor-in sebagai langkah maju dalam partisipasi publik dan tata kelola kota yang baik.",
      name: "Alberthus Dennis",
      avatar: null,
    },
    {
      id: 7,
      quote: "Tes",
      name : "Regi Mayangsari",
      avatar: null,
    },
  ];
  const enableLoop = testimonials.length > 1;
  
  return (
    <section className="bg-blue-50/30 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-10 lg:space-x-16">

          {/* Ilustrasi - Sembunyikan di mobile */}
          <div className="hidden md:flex md:w-1/2 lg:w-2/5 mb-12 md:mb-0 items-center justify-center w-full">
            <img 
              src={ReviewIllustrationUrl} 
              alt="Ilustrasi Tanggapan Masyarakat" 
              className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto object-contain"
            />
          </div>
          
          {/* Konten Testimonial - Full width di mobile */}
          <div className="w-full md:w-1/2 lg:w-3/5">
            <h2 className="text-3xl sm:text-4xl font-montserrat text-slate-800 mb-10 md:mb-12 text-center md:text-left">
              Tanggapan Masyarakat
            </h2>

            <div className="relative testimonial-slider-wrapper mx-auto max-w-xl lg:max-w-2xl">
              <Swiper
                modules={[Navigation, Pagination, A11y]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true, el: '.custom-swiper-pagination' }}
                loop={enableLoop}
                className="testimonial-swiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="bg-white/80 backdrop-blur-sm p-8 sm:p-8 rounded-xl shadow-sm border border-blue-100/50 hover:shadow-md hover:border-blue-200/60 transition-all duration-300 flex flex-col items-center text-center min-h-[280px] sm:min-h-[250px] justify-center box-border">
                      <TestimonialAvatarPlaceholder />
                      <p className="text-slate-600 italic mb-4 leading-relaxed text-sm sm:text-base max-w-md mx-auto">
                        "{testimonial.quote}"
                      </p>
                      <p className="text-slate-700 font-semibold text-sm sm:text-base">
                        - {testimonial.name}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="custom-swiper-pagination flex justify-center space-x-2 mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;