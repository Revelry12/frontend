
import React from 'react';
import Illus from '../../assets/filling.svg'; 
import iconJalanRusak from '../../assets/jalanrusak.png';
import iconDrainaseTersumbat from '../../assets/drainase.png';
import iconPohonTumbang from '../../assets/tree.png';
import iconSampahLiar from '../../assets/garbage.png';

const ProblemExamplesSection = () => {
  const problems = [
    { id: 1, iconSrc: iconJalanRusak, label: "Jalan Rusak" },
    { id: 2, iconSrc: iconDrainaseTersumbat, label: "Drainase Tersumbat" },
    { id: 3, iconSrc: iconPohonTumbang, label: "Pohon Tumbang" },
    { id: 4, iconSrc: iconSampahLiar, label: "Sampah Liar" },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50/40">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-10 lg:space-x-16">
          
          {/* Konten Utama - Full width di mobile */}
          <div className="w-full md:w-1/2 lg:w-3/5 mb-12 md:mb-0">
            <h2 className="text-3xl sm:text-4xl font-montserrat text-slate-800 mb-10 md:mb-12 text-center md:text-left">
              Masalah Yang Dapat Dilaporkan
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/70 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/60 hover:shadow-md hover:border-blue-200/60 hover:bg-blue-50/30 transition-all duration-300 flex items-center justify-center mb-3 sm:mb-4">
                    <img 
                      src={problem.iconSrc}
                      alt={problem.label}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain" 
                    />
                  </div>
                  <p className="text-slate-700 text-montserrat font-semibold text-sm sm:text-base">{problem.label}</p>
                </div>
              ))} 
            </div>
          </div>

          {/* Ilustrasi - Sembunyikan di mobile */}
          <div className="hidden md:flex md:w-1/2 lg:w-2/5 items-center justify-center w-full">
            <img 
              src={Illus} 
              alt="Ilustrasi contoh masalah" 
              className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemExamplesSection;