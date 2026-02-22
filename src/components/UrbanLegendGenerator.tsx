import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MOCK_LEGENDS = [
  "In the basement of Shibuya Station, there is a ticket gate that only opens at 3:33 AM. Those who pass through never return to the Yamanote Line.",
  "The crows in Yoyogi Park aren't birds. They are surveillance drones left over from a failed 1980s government experiment. Listen closely, and you can hear their gears grinding.",
  "If you stare at the Tokyo Tower from a specific angle in Roppongi, you can see the shadow of a second, inverted tower hanging from the sky.",
  "There is a vending machine in Akihabara that sells 'yesterday's memories' in a can. Drinking it makes you forget who you were 24 hours ago."
];

export const UrbanLegendGenerator: React.FC = () => {
  const [legend, setLegend] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI generation delay
    const timer = setTimeout(() => {
      const randomLegend = MOCK_LEGENDS[Math.floor(Math.random() * MOCK_LEGENDS.length)];
      setLegend(randomLegend);
      setIsGenerating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl px-6">
      <div className="border border-red-600/50 bg-black/80 p-6 relative overflow-hidden">
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        <div className="font-mono text-red-500 mb-2 text-xs tracking-widest animate-pulse">
          {isGenerating ? "SCANNING LOCAL REALITY..." : "ANOMALY DETECTED"}
        </div>
        
        <div className="min-h-[100px] flex items-center justify-center">
          {isGenerating ? (
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 30, 10] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                  className="w-2 bg-red-600"
                />
              ))}
            </div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-lg text-red-50 md:text-xl leading-relaxed glitch-text"
              style={{ textShadow: '2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,255,255,0.5)' }}
            >
              "{legend}"
            </motion.p>
          )}
        </div>
        
        {!isGenerating && (
          <button 
            onClick={() => {
              setIsGenerating(true);
              setLegend("");
              setTimeout(() => {
                const randomLegend = MOCK_LEGENDS[Math.floor(Math.random() * MOCK_LEGENDS.length)];
                setLegend(randomLegend);
                setIsGenerating(false);
              }, 1500);
            }}
            className="mt-6 w-full py-2 border border-red-600 text-red-600 font-mono text-sm hover:bg-red-600 hover:text-black transition-colors uppercase tracking-widest"
          >
            Scan Another Frequency
          </button>
        )}
      </div>
    </div>
  );
};
