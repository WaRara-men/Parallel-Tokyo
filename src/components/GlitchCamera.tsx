import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface Props {
  text: string | null;
}

export const GlitchCamera: React.FC<Props> = ({ text }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setError("CAMERA ACCESS DENIED. REALITY UNAVAILABLE.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full max-w-2xl px-6 flex flex-col items-center mt-4 z-10">
      {!isActive ? (
        <button
          onClick={startCamera}
          className="w-full h-48 border-2 border-dashed border-red-900/50 bg-black/50 flex flex-col items-center justify-center gap-4 hover:border-red-600 hover:bg-red-900/10 transition-all group backdrop-blur-sm"
        >
          <Camera size={32} className="text-red-700 group-hover:text-red-500" />
          <span className="text-red-700 font-mono text-xs tracking-widest group-hover:text-red-500">
            INITIATE REALITY BREACH (AR MODE)
          </span>
        </button>
      ) : (
        <div className="relative w-full aspect-video bg-black border border-red-600 overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.3)]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{
              filter: 'hue-rotate(90deg) contrast(1.2) saturate(1.5)',
            }}
          />
          
          {/* AR Text Overlay */}
          {text && (
            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
              <p 
                className="font-mono text-xl md:text-2xl text-white font-bold text-center leading-relaxed"
                style={{ 
                  textShadow: '4px 0 0 rgba(255,0,0,0.8), -4px 0 0 rgba(0,255,255,0.8)',
                  animation: 'shake 0.5s infinite'
                }}
              >
                {text}
              </p>
            </div>
          )}
          
          {/* Glitch Overlay Layers */}
          <div className="absolute inset-0 mix-blend-screen opacity-50 pointer-events-none">
             <div className="w-full h-full bg-red-500/20 animate-pulse" style={{ clipPath: 'inset(10% 0 80% 0)' }} />
             <div className="w-full h-full bg-cyan-500/20 animate-pulse delay-75" style={{ clipPath: 'inset(60% 0 10% 0)' }} />
          </div>

          <div className="absolute top-2 left-2 flex gap-2">
            <div className="px-2 py-0.5 bg-red-600 text-black font-mono text-[10px] font-bold animate-pulse">REC</div>
            <div className="px-2 py-0.5 border border-red-600 text-red-600 font-mono text-[10px]">GLITCH_AR_V1.0</div>
          </div>

          <button
            onClick={stopCamera}
            className="absolute bottom-4 right-4 p-2 bg-black/80 border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-black transition-colors z-20"
          >
            <CameraOff size={20} />
          </button>
        </div>
      )}
      
      {error && (
        <div className="mt-2 text-red-500 font-mono text-xs tracking-widest">
          {error}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};
