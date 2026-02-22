import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateUrbanLegend } from '@/lib/openai';

export const UrbanLegendGenerator: React.FC = () => {
  const [legend, setLegend] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);

  const fetchLegend = async () => {
    setIsGenerating(true);
    setLegend("");
    
    // Get API Key from env or prompt
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || prompt("Enter OpenAI API Key for Chaos Mode (sk-...):");
    
    if (!apiKey) {
      setLegend("ACCESS DENIED. API KEY REQUIRED.");
      setIsGenerating(false);
      return;
    }

    try {
      const story = await generateUrbanLegend(apiKey);
      setLegend(story);
    } catch (error) {
      setLegend("SIGNAL LOST. REALITY IS OFFLINE.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchLegend();
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
            onClick={fetchLegend}
            className="mt-6 w-full py-2 border border-red-600 text-red-600 font-mono text-sm hover:bg-red-600 hover:text-black transition-colors uppercase tracking-widest"
          >
            Scan Another Frequency
          </button>
        )}
      </div>
    </div>
  );
};
