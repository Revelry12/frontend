import React from 'react';
import Header from '../Header/Header.jsx'; // Sesuaikan path jika perlu
import Footer from '../Footer/Footer.jsx'; // Sesuaikan path jika perlu

const Layout = ({ children }) => {
  return (
    // Pembungkus Utama Aplikasi
    // 1. min-h-screen: Membuat div ini setidaknya setinggi layar browser.
    // 2. flex dan flex-col: Mengaktifkan Flexbox dan mengatur elemen di dalamnya (Header, main, Footer) sebagai kolom vertikal.
    <div className="min-h-screen flex flex-col">
      
      <Header />
      
      {/* Konten Utama Halaman */}
      {/* 3. flex-grow: Ini adalah KUNCINYA. Kelas ini akan membuat elemen <main>
          "tumbuh" dan mengambil semua ruang vertikal kosong yang tersedia,
          sehingga mendorong <Footer> ke bagian paling bawah.
      */}
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />

    </div>
  );
};

export default Layout;
