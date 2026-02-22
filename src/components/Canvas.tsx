import React, { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { ItemCard } from './ItemCard';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Item } from '@/types';

export const Canvas: React.FC = () => {
  const items = useCanvasStore((state) => state.items);
  const fetchItems = useCanvasStore((state) => state.fetchItems);
  const setItems = useCanvasStore((state) => state.setItems);

  useEffect(() => {
    fetchItems();

    // Real-time subscription
    const channel = supabase
      .channel('canvas_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          // Ideally we handle INSERT, UPDATE, DELETE separately to update store efficiently
          // For MVP, simplistic approach:
          if (payload.eventType === 'INSERT') {
            useCanvasStore.setState((state) => ({
              items: [...state.items, payload.new as Item]
            }));
          } else if (payload.eventType === 'UPDATE') {
             useCanvasStore.setState((state) => ({
              items: state.items.map(i => i.id === payload.new.id ? payload.new as Item : i)
            }));
          } else if (payload.eventType === 'DELETE') {
             useCanvasStore.setState((state) => ({
              items: state.items.filter(i => i.id !== payload.old.id)
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-zinc-950">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Infinite Canvas Content Area */}
      {/* Note: Real infinite canvas needs pan/zoom logic wrapper. 
          For MVP, we just assume a large fixed area or screen relative. 
          Let's make it a large scrollable area or just fixed viewport for now. */}
      <motion.div 
        className="w-full h-full relative"
        // In a full implementation, we would apply scale and offset transforms here
      >
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </motion.div>
    </div>
  );
};
