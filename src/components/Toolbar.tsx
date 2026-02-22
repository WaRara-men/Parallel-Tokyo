import React, { useState } from 'react';
import { Type, Image as ImageIcon, Link2, Plus, X } from 'lucide-react';
import { useCanvasStore } from '@/store/canvasStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Toolbar: React.FC = () => {
  const addItem = useCanvasStore((state) => state.addItem);
  const [isOpen, setIsOpen] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'image' | 'link' | null>(null);
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !inputType) return;

    // Add item at random position near center for now
    // Ideally we add it to center of viewport
    const x = Math.random() * 200 + window.innerWidth / 2 - 100;
    const y = Math.random() * 200 + window.innerHeight / 2 - 100;

    await addItem(inputType, content, x, y);
    setContent('');
    setInputType(null);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl w-[300px]"
          >
            {inputType ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-400 capitalize">{inputType}</span>
                  <button 
                    type="button" 
                    onClick={() => setInputType(null)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                {inputType === 'text' ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-zinc-800 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={inputType === 'image' ? "Image URL..." : "https://..."}
                    className="w-full bg-zinc-800 text-white rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-md py-2 text-sm font-medium transition-colors"
                >
                  Add to Canvas
                </button>
              </form>
            ) : (
              <div className="flex justify-around items-center">
                <button
                  onClick={() => setInputType('text')}
                  className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-800"
                >
                  <Type size={20} />
                  <span className="text-xs">Text</span>
                </button>
                <button
                  onClick={() => setInputType('image')}
                  className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-800"
                >
                  <ImageIcon size={20} />
                  <span className="text-xs">Image</span>
                </button>
                <button
                  onClick={() => setInputType('link')}
                  className="flex flex-col items-center gap-2 text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-zinc-800"
                >
                  <Link2 size={20} />
                  <span className="text-xs">Link</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white text-black p-4 rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95"
      >
        <Plus size={24} className={isOpen ? "rotate-45 transition-transform" : "transition-transform"} />
      </button>
    </div>
  );
};
