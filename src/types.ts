export type ItemType = 'text' | 'image' | 'link';

export interface Item {
  id: string;
  user_id: string;
  type: ItemType;
  content: string;
  position_x: number;
  position_y: number;
  cluster_id?: string;
  created_at: string;
}

export interface Cluster {
  id: string;
  user_id: string;
  title: string;
  centroid_x: number;
  centroid_y: number;
  created_at: string;
}
