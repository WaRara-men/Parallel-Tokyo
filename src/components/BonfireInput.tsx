import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCanvasStore } from '@/store/canvasStore';

export const BonfireInput: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const addBonfire = useCanvasStore((state) => state.addBonfire);

  const handleBurn = async () => {
    if (!text.trim()) return;
    
    setIsBurning(true);
    
    // Simulate "burning" delay and visual effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Send event to backend
    await addBonfire(Math.min(text.length, 10)); // Intensity based on length
    
    setText('');
    setIsBurning(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-30 p-4 rounded-full bg-zinc-900/80 text-zinc-400 border border-zinc-800 shadow-2xl backdrop-blur-sm hover:text-orange-400 hover:border-orange-900/50 transition-colors ${isOpen ? 'hidden' : 'block'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Flame size={24} />
      </motion.button>

      {/* Input Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Burning Overlay Effect */}
              {isBurning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-orange-500/10 z-50 flex items-center justify-center backdrop-blur-[2px]"
                >
                  <div className="text-orange-500 font-serif tracking-widest animate-pulse">BURNING...</div>
                </motion.div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-zinc-400 font-light tracking-wide text-sm">WHAT'S ON YOUR MIND?</h2>
                <button onClick={() => setIsOpen(false)} className="text-zinc-600 hover:text-zinc-300">
                  <X size={20} />
                </button>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write it down here. It will be burned and disappear forever."
                className="w-full h-40 bg-transparent text-zinc-300 text-lg font-light placeholder:text-zinc-800 focus:outline-none resize-none mb-8"
                autoFocus
              />

              <div className="flex justify-end">
                <button
                  onClick={handleBurn}
                  disabled={!text.trim() || isBurning}
                  className="group flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-900 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Flame size={16} className="group-hover:animate-pulse" />
                  <span className="text-sm tracking-widest">BURN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
