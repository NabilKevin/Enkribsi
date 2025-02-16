import '@/css/loading/index.css';
import { useState, useEffect } from 'react';

const Loading = () => {
  const [chars, setChars] = useState([]); // Array untuk menyimpan huruf-huruf dengan animasi
  const [isFadingOut, setIsFadingOut] = useState(false); // Status fade-out
  const targetText = 'Enkribsi'; // Teks target

  useEffect(() => {
    let interval;

    if (!isFadingOut) {
      // Fade-in logic: Bangun teks karakter per karakter
      interval = setInterval(() => {
        setChars((prevChars) => {
          if (prevChars.length < targetText.length) {
            return [...prevChars, targetText[prevChars.length]]; // Tambahkan satu huruf
          } else {
            setIsFadingOut(true); // Mulai fade-out setelah teks lengkap
            return prevChars;
          }
        });
      }, 250);
    } else {
      // Fade-out logic: Hilangkan seluruh teks sekaligus
      setTimeout(() => {
        setChars([]); // Kosongkan array huruf
        setIsFadingOut(false); // Reset mode fade-out
      }, 250); // Sesuaikan dengan durasi animasi fade-out
    }

    return () => clearInterval(interval); // Membersihkan interval saat komponen unmount
  }, [isFadingOut]);

  return (
    <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-light z-3 d-flex align-items-center justify-content-center">
      {/* Bungkus teks dalam elemen dengan kelas animasi */}
      <h1 id='h1Loading' className={isFadingOut ? 'fade-ouLoadingt' : ''}>
        {chars.map((char, index) => (
          <span key={index} className="fade-inLoading">
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Loading;