import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Scan } from 'lucide-react';

interface Props {
  text: string | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const GlitchCamera: React.FC<Props> = ({ text, onGenerate, isGenerating }) => {
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
    <>
      {!isActive ? (
        <div className="w-full max-w-2xl px-6 flex flex-col items-center mt-4 z-10">
          <button
            onClick={startCamera}
            className="w-full h-48 border-2 border-dashed border-red-900/50 bg-black/50 flex flex-col items-center justify-center gap-4 hover:border-red-600 hover:bg-red-900/10 transition-all group backdrop-blur-sm"
          >
            <Camera size={32} className="text-red-700 group-hover:text-red-500" />
            <span className="text-red-700 font-mono text-xs tracking-widest group-hover:text-red-500">
              INITIATE REALITY BREACH (AR MODE)
            </span>
          </button>
          
          {error && (
            <div className="mt-2 text-red-500 font-mono text-xs tracking-widest">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Fullscreen Video */}
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
          
          {/* AR Overlay UI */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Viewfinder Corners */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-red-600/70" />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-red-600/70" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-red-600/70" />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-red-600/70" />
            
            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 opacity-50">
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-500" />
               <div className="absolute top-0 left-1/2 h-full w-[1px] bg-red-500" />
            </div>

            {/* Scanning Status */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-400 animate-ping' : 'bg-red-600 animate-pulse'}`} />
               <span className="font-mono text-red-500 text-xs tracking-[0.2em]">
                 {isGenerating ? 'ANALYZING ANOMALY...' : 'SYSTEM ACTIVE'}
               </span>
            </div>
            
            {/* Text Overlay */}
            {text && (
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-t from-black/80 via-transparent to-black/20">
                <div className="max-w-md bg-black/40 backdrop-blur-sm border border-red-500/30 p-6 rounded-sm">
                  <p 
                    className="font-mono text-lg md:text-2xl text-red-50 font-bold text-center leading-relaxed"
                    style={{ 
                      textShadow: '2px 0 0 rgba(255,0,0,0.8), -2px 0 0 rgba(0,255,255,0.8)',
                      animation: 'shake 0.5s infinite'
                    }}
                  >
                    "{text}"
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Glitch Overlay Layers */}
          <div className="absolute inset-0 mix-blend-screen opacity-50 pointer-events-none">
             <div className="w-full h-full bg-red-500/10 animate-pulse" style={{ clipPath: 'inset(10% 0 80% 0)' }} />
             <div className="w-full h-full bg-cyan-500/10 animate-pulse delay-75" style={{ clipPath: 'inset(60% 0 10% 0)' }} />
          </div>

          {/* Controls (Clickable) */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 px-8 z-50">
            <button
              onClick={stopCamera}
              className="p-4 bg-black/80 border border-red-600/50 text-red-600 rounded-full hover:bg-red-600 hover:text-black transition-colors"
            >
              <CameraOff size={24} />
            </button>
            
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="relative p-6 bg-red-600/20 border-2 border-red-500 rounded-full hover:bg-red-600/40 transition-all disabled:opacity-50 disabled:cursor-wait group"
            >
              <Scan size={32} className={`text-red-50 ${isGenerating ? 'animate-spin' : ''}`} />
              <div className="absolute -inset-2 border border-red-500/30 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
            </button>
            
            <div className="w-[56px]" /> {/* Spacer for symmetry */}
          </div>
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
    </>
  );
};
