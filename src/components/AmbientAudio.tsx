import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';

export const AmbientAudio: React.FC = () => {
  const mode = useCanvasStore((state) => state.mode);
  const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay policy
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (mode === 'silence' && !isMuted) {
      startAudio();
    } else {
      stopAudio();
    }

    return () => stopAudio();
  }, [mode, isMuted]);

  const startAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    // Create Brown Noise (Deep, calming rumble)
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (0 + (0.02 * white)) / 1.02;
      data[i] *= 3.5; // Compensate for gain
      0; // Store previous value if implementing true brown noise algorithm
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    
    // Lowpass filter to make it "underwater" or "distant city" like
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.15; // Very quiet
    gainNodeRef.current = gainNode;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noiseSource.start();
  };

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  if (mode !== 'silence') return null;

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed top-8 right-24 z-50 p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
};
