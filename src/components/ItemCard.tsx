import React from 'react';
import { motion } from 'framer-motion';
import { Item } from '@/types';
import { useCanvasStore } from '@/store/canvasStore';
import { Link2, Image as ImageIcon, FileText } from 'lucide-react';
import clsx from 'clsx';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const updateItemPosition = useCanvasStore((state) => state.updateItemPosition);
  const scale = useCanvasStore((state) => state.scale);

  const handleDragEnd = (_: any, info: any) => {
    // Calculate new position based on drag delta
    // This is a simplified version; in a real infinite canvas, we need to account for scale and offset
    // For this MVP, we update based on visual position, but the robust math would be:
    // newX = item.position_x + info.offset.x / scale
    // newY = item.position_y + info.offset.y / scale
    // However, framer-motion's drag modifies the transform, so we need to be careful.
    // Let's use the onDragEnd to commit the final position.
    
    // Actually, to keep it simple with framer-motion drag, we can track the position state
    // But since we are storing absolute coordinates, we should update the store.
    const newX = item.position_x + info.offset.x / scale;
    const newY = item.position_y + info.offset.y / scale;
    updateItemPosition(item.id, newX, newY);
  };

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        return (
          <div className="relative group">
            <img 
              src={item.content} 
              alt="User content" 
              className="max-w-[200px] rounded-md object-cover pointer-events-none" 
            />
            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon size={12} />
            </div>
          </div>
        );
      case 'link':
        return (
          <a 
            href={item.content} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-blue-400 hover:underline break-all max-w-[200px]"
            onPointerDown={(e) => e.stopPropagation()} // Allow clicking link without dragging immediately
          >
            <Link2 size={16} className="shrink-0" />
            <span className="truncate">{item.content}</span>
          </a>
        );
      case 'text':
      default:
        return (
          <div className="max-w-[200px] text-zinc-200 whitespace-pre-wrap">
            {item.content}
          </div>
        );
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: item.position_x, y: item.position_y, scale: 0.9, opacity: 0 }}
      animate={{ x: item.position_x, y: item.position_y, scale: 1, opacity: 1 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileDrag={{ scale: 1.05, zIndex: 20, cursor: 'grabbing' }}
      className={clsx(
        "absolute bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 rounded-xl p-4 shadow-lg cursor-grab",
        "flex flex-col gap-2 min-w-[150px]"
      )}
      style={{
        // We rely on animate prop for positioning, but we can also use style if we want to bypass react render loop for perf
        // But for MVP, animate is fine.
        left: 0, 
        top: 0,
      }}
    >
      {/* Header/Icon for type indication if needed, or just clean content */}
      {item.type === 'text' && <FileText size={14} className="text-zinc-500 mb-1" />}
      {renderContent()}
    </motion.div>
  );
};
