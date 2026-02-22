import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Profile, Bonfire, UserStatus } from '@/types';

interface CanvasState {
  profiles: Profile[];
  bonfires: Bonfire[];
  isLoading: boolean;
  currentUserStatus: UserStatus;
  
  // Actions
  fetchProfiles: () => Promise<void>;
  updateStatus: (status: UserStatus) => Promise<void>;
  addBonfire: (intensity: number) => Promise<void>;
  setProfiles: (profiles: Profile[]) => void;
  addBonfireEvent: (bonfire: Bonfire) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  profiles: [],
  bonfires: [],
  isLoading: false,
  currentUserStatus: 'neutral',

  fetchProfiles: async () => {
    set({ isLoading: true });
    
    // Fetch active profiles (e.g., active in last 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .gt('last_active_at', oneHourAgo);

    if (error) {
      console.error('Error fetching profiles:', error);
    }

    set({ profiles: profiles || [], isLoading: false });
  },

  updateStatus: async (status) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set({ currentUserStatus: status });

    // Optimistic update
    set((state) => ({
      profiles: state.profiles.map(p => p.id === user.id ? { ...p, status } : p)
    }));

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, status, last_active_at: new Date().toISOString() });

    if (error) {
      console.error('Error updating status:', error);
    }
  },

  addBonfire: async (intensity) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('bonfires')
      .insert({ user_id: user.id, intensity });

    if (error) {
      console.error('Error creating bonfire:', error);
    }
  },

  setProfiles: (profiles) => set({ profiles }),
  addBonfireEvent: (bonfire) => {
    set((state) => ({ bonfires: [...state.bonfires, bonfire] }));
    // Auto-remove bonfire after animation duration (e.g., 5 seconds)
    setTimeout(() => {
      set((state) => ({
        bonfires: state.bonfires.filter(b => b.id !== bonfire.id)
      }));
    }, 5000);
  }
}));
