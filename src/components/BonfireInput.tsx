import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Send, Sparkles } from 'lucide-react';
import { useCanvasStore } from '../store/canvasStore';
import { generatePurification } from '../lib/gemini';

export const BonfireInput: React.FC = () => {
  const [text, setText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [purificationMessage, setPurificationMessage] = useState<string | null>(null);
  const addBonfire = useCanvasStore((state) => state.addBonfire);

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsBurning(true);
    setPurificationMessage(null); // Reset message

    // Add visual bonfire immediately
    const id = Math.random().toString(36).substr(2, 9);
    addBonfire({
      id,
      text: text,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      intensity: 1,
      createdAt: Date.now(),
    });

    const worryText = text;
    
    // Burning animation delay
    setTimeout(async () => {
      setText('');
      setIsBurning(false);
      
      // Generate purification message after burning
      const message = await generatePurification(worryText);
      setPurificationMessage(message);
      
      // Clear message after 10 seconds
      setTimeout(() => {
        setPurificationMessage(null);
      }, 10000);
    }, 1500);
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
      <AnimatePresence>
        {purificationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-6 bg-black/40 backdrop-blur-md border border-orange-500/20 rounded-lg text-center shadow-2xl shadow-orange-900/20"
          >
            <Sparkles className="w-5 h-5 text-orange-300 mx-auto mb-2 opacity-70" />
            <p className="text-orange-100/90 font-serif leading-relaxed text-sm md:text-base">
              {purificationMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleBurn} className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="燃やしたい感情を入力..."
          className="w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-full py-4 pl-6 pr-14 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all shadow-lg"
          disabled={isBurning}
        />
        <button
          type="submit"
          disabled={!text.trim() || isBurning}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600/80 hover:bg-orange-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isBurning ? (
            <Flame className="w-5 h-5 animate-pulse text-yellow-200" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
        
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 rounded-full blur-xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      </form>
    </div>
  );
};
