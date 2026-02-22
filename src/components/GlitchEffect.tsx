import React from 'react';
import { useCanvasStore } from '@/store/canvasStore';

export const GlitchEffect: React.FC = () => {
  const mode = useCanvasStore((state) => state.mode);

  if (mode !== 'chaos') return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden mix-blend-overlay opacity-50">
      {/* CSS Glitch Animation */}
      <style>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 40% 0); transform: translate(1px, -1px); }
        }
        .glitch-layer {
          animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
          background: rgba(255, 0, 0, 0.2);
        }
      `}</style>
      <div className="glitch-layer absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
    </div>
  );
};
