import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types';

export type AppMode = 'silence' | 'chaos';
export type UserStatus = 'tired' | 'melancholy' | 'calm' | 'anxious' | 'neutral';

export interface VisualBonfire {
  id: string;
  userId: string;
  text: string;
  x: number;
  y: number;
  intensity: number;
  createdAt: number;
}

interface CanvasState {
  profiles: Profile[];
  bonfires: VisualBonfire[];
  isLoading: boolean;
  currentUserStatus: UserStatus;
  mode: AppMode;
  
  // Actions
  fetchProfiles: () => Promise<void>;
  updateStatus: (status: string) => Promise<void>;
  addBonfire: (data: Omit<VisualBonfire, 'userId'>) => void;
  setProfiles: (profiles: any[]) => void;
  setMode: (mode: 'silence' | 'chaos') => void;
  toggleMode: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  profiles: [],
  bonfires: [],
  isLoading: false,
  currentUserStatus: 'neutral',
  mode: 'silence',

  fetchProfiles: async () => {
    // Mock implementation for now
    set({ isLoading: false });
  },

  updateStatus: async (status) => {
    // Cast string to UserStatus for internal state
    set({ currentUserStatus: status as UserStatus });
  },

  addBonfire: (data) => {
    // Add local visual bonfire
    set((state) => ({ 
      bonfires: [...state.bonfires, { ...data, userId: 'local' }] 
    }));
    
    // Auto-remove after animation
    setTimeout(() => {
      set((state) => ({
        bonfires: state.bonfires.filter(b => b.id !== data.id)
      }));
    }, 5000);
  },

  setProfiles: (profiles) => set({ profiles }),
  
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'silence' ? 'chaos' : 'silence' })),
}));
