import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';
import { motion } from 'framer-motion';
import { organizeItemsWithAI } from '@/lib/ai';

export const OrganizeButton: React.FC = () => {
  const items = useCanvasStore((state) => state.items);
  const updateItemPosition = useCanvasStore((state) => state.updateItemPosition);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleOrganize = async () => {
    if (items.length < 2) {
      alert("Add at least 2 items to organize!");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || prompt("Enter your OpenAI API Key (sk-...):");
    
    if (!apiKey) {
      alert("API Key is required for AI features.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await organizeItemsWithAI(items, apiKey);
      
      console.log("AI Result:", result);

      // Apply the new positions
      // We process sequentially or in parallel, but state updates might be batched
      // Let's just loop and update
      if (result.clusters) {
        for (const cluster of result.clusters) {
          // Ideally we would create cluster entities in DB too, but for MVP just move items
          for (const itemPos of cluster.items) {
            await updateItemPosition(itemPos.id, itemPos.x, itemPos.y);
          }
        }
      }
      
    } catch (error: any) {
      console.error("Error organizing items:", error);
      alert("Failed to organize: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOrganize}
      disabled={isProcessing || items.length === 0}
      className="fixed top-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
      <span>{isProcessing ? 'Thinking...' : 'Organize'}</span>
    </motion.button>
  );
};
