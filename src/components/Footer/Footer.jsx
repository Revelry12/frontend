import React from 'react';
import { FaCopyright } from 'react-icons/fa';

export default function Footer() {
  return (
    // Menggunakan tag <footer> untuk semantik HTML yang lebih baik
    // KELAS mt-12 md:mt-16 DIHAPUS DARI SINI
    <footer className="w-full bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] shadow-md py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left text-sm">
          <div className="flex items-center space-x-2 text-white mb-4 sm:mb-0">
            {/* Ikon Copyright */}
            <FaCopyright size={16}/>
            
            <p>
              Copyright &copy; {new Date().getFullYear()} Lapor-in. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
