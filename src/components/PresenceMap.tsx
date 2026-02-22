import React, { useEffect } from 'react';
import { useCanvasStore } from '@/store/canvasStore';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Bonfire } from '@/types';

// Helper to generate a consistent but random-looking position based on user ID
const getUserPosition = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  // Map hash to percentage 10-90 to keep away from edges
  const x = Math.abs(hash % 80) + 10;
  const y = Math.abs((hash >> 8) % 80) + 10;
  return { x, y };
};

// Helper to get color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'tired': return 'bg-blue-900/40 shadow-[0_0_30px_rgba(30,58,138,0.5)]'; // Deep Blue
    case 'melancholy': return 'bg-purple-900/40 shadow-[0_0_30px_rgba(88,28,135,0.5)]'; // Purple
    case 'anxious': return 'bg-red-900/20 shadow-[0_0_30px_rgba(127,29,29,0.3)]'; // Faint Red
    case 'calm': return 'bg-emerald-900/40 shadow-[0_0_30px_rgba(6,78,59,0.5)]'; // Green
    default: return 'bg-zinc-700/30 shadow-[0_0_30px_rgba(63,63,70,0.3)]'; // Grey
  }
};

export const PresenceMap: React.FC = () => {
  const profiles = useCanvasStore((state) => state.profiles);
  const bonfires = useCanvasStore((state) => state.bonfires);
  const fetchProfiles = useCanvasStore((state) => state.fetchProfiles);
  const addBonfire = useCanvasStore((state) => state.addBonfire);

  useEffect(() => {
    fetchProfiles();

    // Subscribe to presence changes (profiles)
    const profileChannel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
           if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
             fetchProfiles(); 
           }
        }
      )
      .subscribe();

    // Subscribe to bonfire events
    const bonfireChannel = supabase
      .channel('public:bonfires')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bonfires' },
        (payload) => {
          // Convert DB bonfire to visual bonfire
          const dbBonfire = payload.new as Bonfire;
          const pos = getUserPosition(dbBonfire.user_id);
          
          addBonfire({
            id: dbBonfire.id,
            text: "Someone is burning...", // We don't get text from DB for privacy
            x: (pos.x / 100) * window.innerWidth,
            y: (pos.y / 100) * window.innerHeight,
            intensity: dbBonfire.intensity,
            createdAt: Date.now()
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(bonfireChannel);
    };
  }, [fetchProfiles, addBonfire]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050505]">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/10 to-black pointer-events-none" />
      
      {/* Other Users (Shadows) */}
      {profiles.map((profile) => {
        const pos = getUserPosition(profile.id);
        const colorClass = getStatusColor(profile.status);
        
        return (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
              x: `${pos.x}vw`,
              y: `${pos.y}vh`
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute w-32 h-32 rounded-full blur-3xl ${colorClass}`}
          />
        );
      })}

      {/* Bonfires (Visual Events) */}
      {bonfires.map((bonfire) => (
        <motion.div
          key={bonfire.id}
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0.5, 2, 3],
            y: -100 // Rise up
          }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute z-20 pointer-events-none"
          style={{ left: bonfire.x, top: bonfire.y }}
        >
          <div className="w-4 h-4 bg-orange-500 rounded-full blur-sm shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
          <div className="absolute top-0 left-0 w-full h-full animate-ping bg-orange-400 rounded-full opacity-75" />
        </motion.div>
      ))}
      
      <div className="absolute bottom-8 left-8 text-zinc-600 text-xs tracking-widest pointer-events-none font-mono opacity-50">
        PARALLEL TOKYO : SILENCE LAYER
      </div>
    </div>
  );
};
