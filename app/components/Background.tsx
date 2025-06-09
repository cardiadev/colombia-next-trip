import React from 'react';
import Image from 'next/image';

type BackgroundProps = {
  children: React.ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  // Fondo fijo para la aplicación
  const bgClass = 'bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700';

  return (
    <div className={`min-h-screen relative overflow-hidden ${bgClass}`}>
      {/* Patrones de fondo */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 z-0" />
      
      {/* Overlay de color */}
      <div className="absolute inset-0 bg-black/10 z-0" />
      
      {/* Efecto de luz radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-white/10 to-transparent opacity-30 z-0" />
      
      {/* Bandera de Colombia en el fondo */}
      <div className="absolute top-0 right-0 w-40 h-40 md:w-60 md:h-60 opacity-10 z-0 rotate-12">
        <Image
          src="/images/colombia-flag.svg"
          alt="Bandera de Colombia"
          width={240}
          height={240}
          className="object-contain"
        />
      </div>
      
      {/* Bandera de Colombia en la parte inferior izquierda */}
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-60 md:h-60 opacity-10 z-0 -rotate-12">
        <Image
          src="/images/colombia-flag.svg"
          alt="Bandera de Colombia"
          width={240}
          height={240}
          className="object-contain"
        />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-4">
        {children}
      </div>
    </div>
  );
} 