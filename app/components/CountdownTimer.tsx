import { useState, useEffect, useCallback } from 'react';
import Countdown from 'react-countdown';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Fechas importantes (centralizadas) - exportadas para usar en otros componentes
export const DEPARTURE_GDL_DATE = new Date('2025-07-02T17:00:00-06:00'); // 5 PM Guadalajara
export const ARRIVAL_BOG_DATE = new Date('2025-07-03T01:00:00-05:00'); // 1 AM Bogotá
export const DEPARTURE_BOG_DATE = new Date('2025-07-03T06:00:00-05:00'); // 6 AM Bogotá
export const ARRIVAL_BGA_DATE = new Date('2025-07-03T07:00:00-05:00'); // 7 AM Bucaramanga



type CountdownTimerProps = {
  onComplete: () => void;
};

// Interfaz para los props del renderer
interface CountdownRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

// Componente para mostrar los dígitos sin fondo 
const CountdownDigit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-5xl md:text-6xl lg:text-7xl font-mono-custom font-bold text-white px-4 py-2 transition-all duration-300 hover:scale-105">
      {value < 10 ? `0${value}` : value}
    </span>
    <span className="text-sm font-semibold text-white/90 uppercase tracking-wider font-body mt-2">{label}</span>
  </div>
);

export default function CountdownTimer({ onComplete }: CountdownTimerProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  
  // Estado para la fecha objetivo del contador - por defecto es la fecha de salida de Guadalajara
  const [targetDate, setTargetDate] = useState<Date>(DEPARTURE_GDL_DATE);
  
  // Estado para controlar el modo de visualización - siempre iniciamos en "waiting"
  const [displayMode, setDisplayMode] = useState<
    'waiting' | 'to_bogota' | 'in_bogota' | 'arrived'
  >('waiting');

  // Este estado fuerza la actualización del contador cuando cambia
  const [key, setKey] = useState(0);

  // Estado para verificar si está activado el modo debug
  const [debugMode, setDebugMode] = useState(false);

  // Verificar localStorage para el modo debug
  useEffect(() => {
    const checkDebugMode = () => {
      const debugEnabled = localStorage.getItem('tripDebugMode') === 'true';
      setDebugMode(debugEnabled);
    };

    // Verificar al cargar
    checkDebugMode();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', checkDebugMode);

    return () => {
      window.removeEventListener('storage', checkDebugMode);
    };
  }, []);

  // Función para manejar los cambios de fecha y modo
  const handleDateChange = useCallback((mode: 'waiting' | 'to_bogota' | 'in_bogota' | 'arrived') => {
    setDisplayMode(mode);
    
    switch(mode) {
      case 'waiting':
        // Usamos la fecha real de salida de Guadalajara
        setTargetDate(DEPARTURE_GDL_DATE);
        setShowConfetti(false);
        break;
      case 'to_bogota':
        // Usamos la fecha real de llegada a Bogotá
        setTargetDate(ARRIVAL_BOG_DATE);
        setShowConfetti(false);
        break;
      case 'in_bogota':
        // Usamos la fecha real de llegada a Bucaramanga
        setTargetDate(ARRIVAL_BGA_DATE);
        setShowConfetti(false);
        break;
      case 'arrived':
        // Para el modo de llegada, solo mostramos el confeti
        setShowConfetti(true);
        onComplete();
        break;
    }

    // Forzamos la actualización del componente Countdown
    setKey(prevKey => prevKey + 1);
  }, [onComplete]);

  // Inicializamos en modo "esperando" al cargar
  useEffect(() => {
    // Establecemos explícitamente el modo "waiting" al iniciar
    handleDateChange('waiting');
  }, [handleDateChange]); // Solo se ejecuta una vez al cargar

  // Renderizador de la cuenta regresiva
  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRendererProps) => {
    // Si estamos en modo "arrived", mostrar el mensaje de llegada sin contador
    if (displayMode === 'arrived') {
      return (
        <div className="text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¡Ya llegué a Bucaramanga!
          </h2>
          
          <p className="text-xl md:text-2xl mb-6 text-white/90">
            Ya estoy listo para verte
          </p>
          
          {/* No mostramos el contador en modo llegada */}
        </div>
      );
    }

    // Si el contador ha terminado (fecha ya pasó), mostrar mensaje
    if (completed) {
      return (
        <div className="text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {displayMode === 'waiting' && '¡Es hora de partir!'}
            {displayMode === 'to_bogota' && '¡Ya debería estar en Bogotá!'}
            {displayMode === 'in_bogota' && '¡Ya debería estar en Bucaramanga!'}
          </h2>
          
          <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-3 md:gap-4 w-full p-6 rounded-xl">
            <CountdownDigit value={0} label="Días" />
            <CountdownDigit value={0} label="Hrs" />
            <CountdownDigit value={0} label="Min" />
            <CountdownDigit value={0} label="Seg" />
          </div>
        </div>
      );
    }
    
    // Para otros modos, mostrar la cuenta regresiva con los días, horas, etc.
    return (
      <div className="text-center w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {displayMode === 'waiting' && 'Cuenta regresiva para verte'}
          {displayMode === 'to_bogota' && 'En camino a Bogotá'}
          {displayMode === 'in_bogota' && 'Esperando vuelo a Bucaramanga'}
        </h2>
        
        <div className="grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-3 md:gap-4 w-full p-6 rounded-xl">
          <CountdownDigit value={days} label="Días" />
          <CountdownDigit value={hours} label="Hrs" />
          <CountdownDigit value={minutes} label="Min" />
          <CountdownDigit value={seconds} label="Seg" />
        </div>
      </div>
    );
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
        />
      )}
      
      <div className="w-full max-w-2xl mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
        {/* Solo renderizamos el Countdown si no estamos en modo "arrived" */}
        {displayMode !== 'arrived' ? (
          <Countdown key={key} date={targetDate} renderer={renderer} />
        ) : (
          <div className="text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ¡Ya llegué a Bucaramanga!
            </h2>
            
            <p className="text-xl md:text-2xl mb-6 text-white/90">
              Ya estoy listo para verte
            </p>
          </div>
        )}
      </div>
      
      {/* Botones flotantes para pruebas - solo se muestran si debugMode está activado */}
      {debugMode && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <button 
            onClick={() => handleDateChange('waiting')}
            className={`px-4 py-2 rounded-lg font-medium shadow-lg ${displayMode === 'waiting' ? 'bg-indigo-500 text-white' : 'bg-white/80 text-black'}`}
          >
            Esperando
          </button>
          <button 
            onClick={() => handleDateChange('to_bogota')}
            className={`px-4 py-2 rounded-lg font-medium shadow-lg ${displayMode === 'to_bogota' ? 'bg-blue-500 text-white' : 'bg-white/80 text-black'}`}
          >
            Vuelo a Bogotá
          </button>
          <button 
            onClick={() => handleDateChange('in_bogota')}
            className={`px-4 py-2 rounded-lg font-medium shadow-lg ${displayMode === 'in_bogota' ? 'bg-teal-500 text-white' : 'bg-white/80 text-black'}`}
          >
            En Bogotá
          </button>
          <button 
            onClick={() => handleDateChange('arrived')}
            className={`px-4 py-2 rounded-lg font-medium shadow-lg ${displayMode === 'arrived' ? 'bg-pink-500 text-white' : 'bg-white/80 text-black'}`}
          >
            Llegada
          </button>
        </div>
      )}
    </>
  );
} 