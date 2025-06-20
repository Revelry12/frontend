import React from 'react';
import { FaBullseye, FaRegLightbulb, FaUsers } from 'react-icons/fa';

const AboutSection = () => {
  const features = [
    {
      icon: <FaBullseye className="h-10 w-10 text-orange-500" />,
      title: 'Misi Kami',
      description: 'Menyediakan platform yang efisien dan transparan untuk menjembatani komunikasi antara warga dan pemerintah Kota Batam.'
    },
    {
      icon: <FaRegLightbulb className="h-10 w-10 text-orange-500" />,
      title: 'Visi Kami',
      description: 'Mewujudkan Kota Batam yang lebih responsif, maju, dan nyaman melalui partisipasi aktif warganya.'
    },
    {
      icon: <FaUsers className="h-10 w-10 text-orange-500" />,
      title: 'Nilai Kami',
      description: 'Integritas, Kolaborasi, dan Inovasi menjadi landasan kami dalam melayani setiap laporan dari masyarakat.'
    }
  ];

  return (
    <section id="about-section" className="bg-white pt-16 md:pt-24 pb-4 md:pb-6">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
            Tentang Lapor-in
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Lapor-in adalah sebuah platform digital yang lahir dari inisiatif untuk menciptakan perubahan positif. Kami percaya bahwa setiap laporan adalah suara berharga yang dapat mendorong perbaikan nyata, menjadikan Batam kota yang lebih baik untuk kita tinggali bersama.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 md:gap-12 text-center">
          {features.map((feature) => (
            <div key={feature.title} className="p-6">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-orange-100 mx-auto mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
