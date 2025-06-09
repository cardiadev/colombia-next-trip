'use client';

import { useState, useEffect } from 'react';
import Background from './components/Background';
import CountdownTimer from './components/CountdownTimer';
import TripDetails from './components/TripDetails';
import { ARRIVAL_BGA_DATE } from './components/CountdownTimer';

export default function Home() {
  const [message, setMessage] = useState('Contando los días para verte ❤️');

  useEffect(() => {
    // Verificar si ya llegó a Bucaramanga
    const checkIfArrived = () => {
      const now = new Date();
      if (now >= ARRIVAL_BGA_DATE) {
        setMessage('¡Por fin en Bucaramanga! ❤️');
      }
    };

    checkIfArrived();
    const interval = setInterval(checkIfArrived, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCountdownComplete = () => {
    // Opcional: lógica adicional cuando se complete la cuenta regresiva
    console.log('¡Cuenta regresiva completada!');
  };

  return (
    <Background>
      <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center font-display">
          Mi viaje a Colombia
        </h1>
        
        <p className="text-xl text-white/90 text-center font-body">
          {message}
        </p>
        
        <CountdownTimer onComplete={handleCountdownComplete} />
        
        <TripDetails />
      </div>
    </Background>
  );
}
