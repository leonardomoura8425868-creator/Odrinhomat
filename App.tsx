
import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, Move, Clock as ClockIcon, Calendar, GripVertical } from 'lucide-react';
import { THEMES } from './constants';
import { Theme, ClockSettings, TimeState } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ClockSettings>({
    theme: 'cyberpunk',
    showSeconds: true,
    is24Hour: true,
    showDate: true,
    transitiveMode: true
  });

  const [time, setTime] = useState<TimeState>({
    hours: '00',
    minutes: '00',
    seconds: '00',
    date: '',
    dayOfWeek: ''
  });

  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Positioning and Dragging State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clockRef = useRef<HTMLDivElement>(null);

  // Initialize position to top-right area for a widget feel
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 300,
      y: 50
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, '0'),
        minutes: now.getMinutes().toString().padStart(2, '0'),
        seconds: now.getSeconds().toString().padStart(2, '0'),
        date: now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
        dayOfWeek: now.toLocaleDateString('pt-BR', { weekday: 'short' })
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const constrainPosition = (x: number, y: number) => {
    if (!clockRef.current) return { x, y };
    const rect = clockRef.current.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  };

  const startDragging = (clientX: number, clientY: number) => {
    if (clockRef.current) {
      setIsDragging(true);
      const rect = clockRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    startDragging(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startDragging(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const newX = clientX - dragOffset.current.x;
        const newY = clientY - dragOffset.current.y;
        setPosition(constrainPosition(newX, newY));
      }
    };
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const stopDragging = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', stopDragging);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleResize = () => setPosition(prev => constrainPosition(prev.x, prev.y));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let timeout: number;
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener('mousemove', resetTimeout);
    resetTimeout();
    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      clearTimeout(timeout);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const currentTheme = THEMES[settings.theme];

  return (
    <div className={`fixed inset-0 w-full h-full transition-colors duration-1000 ${currentTheme.bg} overflow-hidden font-sans`}>
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${currentTheme.gradient} blur-3xl pointer-events-none`} />

      {/* Mini Clock Widget */}
      <div 
        ref={clockRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          touchAction: 'none'
        }}
        className={`
          z-10 flex flex-col items-center justify-center select-none text-center p-5 rounded-2xl
          transition-shadow duration-300 group
          ${isDragging ? 'cursor-grabbing scale-105 opacity-90 shadow-2xl' : 'cursor-grab hover:bg-white/5'}
          ${settings.transitiveMode && !isDragging ? 'animate-float' : ''}
        `}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity">
          <GripVertical size={14} className={currentTheme.text} />
        </div>

        {settings.showDate && (
          <div className={`mb-2 flex flex-col items-center opacity-80 transition-all duration-700 ${currentTheme.text}`}>
            <span className="text-[9px] font-light uppercase tracking-[0.2em]">
              {time.dayOfWeek}
            </span>
            <span className="text-[9px] font-medium tracking-wider opacity-60">
              {time.date}
            </span>
          </div>
        )}

        <div className={`flex items-baseline ${currentTheme.font} ${currentTheme.text} transition-all duration-700`}>
          <div className="flex flex-col items-center">
             <span className="text-4xl md:text-5xl font-extrabold leading-none tracking-tighter drop-shadow-lg">
              {time.hours}
            </span>
          </div>
          
          <span className={`text-2xl md:text-3xl font-thin mx-1.5 mb-1 animate-pulse opacity-50`}>:</span>
          
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-extrabold leading-none tracking-tighter drop-shadow-lg">
              {time.minutes}
            </span>
          </div>

          {settings.showSeconds && (
            <>
               <span className="text-lg md:text-xl font-thin mx-1 mb-0.5 opacity-30">:</span>
               <div className="flex flex-col items-center min-w-[2ch]">
                <span className="text-xl md:text-2xl font-light leading-none opacity-60">
                  {time.seconds}
                </span>
              </div>
            </>
          )}
        </div>

        <div className={`absolute -inset-2 ${currentTheme.glow} rounded-2xl blur-xl -z-10 opacity-20`} />
      </div>

      {/* Controls Overlay */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-2 rounded-xl flex items-center gap-1.5 shadow-2xl">
          <div className="flex gap-1.5 p-1 border-r border-white/10 pr-2">
            {(Object.keys(THEMES) as Theme[]).map((t) => (
              <button
                key={t}
                onClick={(e) => { e.stopPropagation(); setSettings(s => ({ ...s, theme: t })); }}
                className={`w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 ${settings.theme === t ? 'border-white scale-110' : 'border-transparent'} ${THEMES[t].accent}`}
                title={t}
              />
            ))}
          </div>

          <ControlButton 
            active={settings.showSeconds} 
            onClick={() => setSettings(s => ({ ...s, showSeconds: !s.showSeconds }))}
            icon={<ClockIcon size={14} />}
            tooltip="Segundos"
          />
          
          <ControlButton 
            active={settings.showDate} 
            onClick={() => setSettings(s => ({ ...s, showDate: !s.showDate }))}
            icon={<Calendar size={14} />}
            tooltip="Data"
          />

          <ControlButton 
            active={settings.transitiveMode} 
            onClick={() => setSettings(s => ({ ...s, transitiveMode: !s.transitiveMode }))}
            icon={<Move size={14} />}
            tooltip="Widget Vivo"
          />

          <div className="w-px h-5 bg-white/10 mx-1" />

          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const ControlButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; tooltip: string }> = ({ active, onClick, icon, tooltip }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`p-2 rounded-lg transition-all relative group ${active ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
  >
    {icon}
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
      {tooltip}
    </span>
  </button>
);

export default App;
