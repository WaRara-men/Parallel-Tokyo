import React from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { motion } from 'framer-motion';
import { Moon, Zap } from 'lucide-react';
import clsx from 'clsx';

export const ModeSwitcher: React.FC = () => {
  const mode = useCanvasStore((state) => state.mode);
  const toggleMode = useCanvasStore((state) => state.toggleMode);

  return (
    <button
      onClick={toggleMode}
      className={clsx(
        "fixed top-8 right-8 z-50 p-1 rounded-full flex items-center gap-2 border transition-all duration-500",
        mode === 'silence' 
          ? "bg-zinc-900 border-zinc-700 shadow-lg" 
          : "bg-black border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
      )}
    >
      <div className="relative w-16 h-8 rounded-full overflow-hidden">
        <motion.div
          initial={false}
          animate={{ x: mode === 'silence' ? 0 : 32 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={clsx(
            "absolute top-0 left-0 w-8 h-8 rounded-full flex items-center justify-center",
            mode === 'silence' ? "bg-zinc-700 text-zinc-300" : "bg-red-600 text-black"
          )}
        >
          {mode === 'silence' ? <Moon size={14} /> : <Zap size={14} />}
        </motion.div>
      </div>
    </button>
  );
};
