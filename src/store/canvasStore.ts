import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Item, Cluster, ItemType } from '@/types';

interface CanvasState {
  items: Item[];
  clusters: Cluster[];
  isLoading: boolean;
  scale: number;
  offset: { x: number; y: number };
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (type: ItemType, content: string, x: number, y: number) => Promise<void>;
  updateItemPosition: (id: string, x: number, y: number) => Promise<void>;
  setItems: (items: Item[]) => void;
  setClusters: (clusters: Cluster[]) => void;
  setScale: (scale: number) => void;
  setOffset: (offset: { x: number; y: number }) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  items: [],
  clusters: [],
  isLoading: false,
  scale: 1,
  offset: { x: 0, y: 0 },

  fetchItems: async () => {
    set({ isLoading: true });
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*');
    
    if (itemsError) {
      console.error('Error fetching items:', itemsError);
    }

    const { data: clusters, error: clustersError } = await supabase
      .from('clusters')
      .select('*');

    if (clustersError) {
      console.error('Error fetching clusters:', clustersError);
    }

    set({ 
      items: items || [], 
      clusters: clusters || [], 
      isLoading: false 
    });
  },

  addItem: async (type, content, x, y) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const newItem = {
      user_id: user.id,
      type,
      content,
      position_x: x,
      position_y: y,
    };

    // Optimistic update
    const tempId = crypto.randomUUID();
    set((state) => ({
      items: [...state.items, { ...newItem, id: tempId, created_at: new Date().toISOString() } as Item],
    }));

    const { data, error } = await supabase
      .from('items')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
      // Revert optimistic update
      set((state) => ({
        items: state.items.filter(i => i.id !== tempId),
      }));
    } else if (data) {
      // Replace temp item with real one
      set((state) => ({
        items: state.items.map(i => i.id === tempId ? data : i),
      }));
    }
  },

  updateItemPosition: async (id, x, y) => {
    // Optimistic update
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, position_x: x, position_y: y } : item
      ),
    }));

    const { error } = await supabase
      .from('items')
      .update({ position_x: x, position_y: y })
      .eq('id', id);

    if (error) {
      console.error('Error updating item position:', error);
    }
  },

  setItems: (items) => set({ items }),
  setClusters: (clusters) => set({ clusters }),
  setScale: (scale) => set({ scale }),
  setOffset: (offset) => set({ offset }),
}));
