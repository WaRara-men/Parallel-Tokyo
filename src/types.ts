export type UserStatus = 'tired' | 'melancholy' | 'calm' | 'anxious' | 'neutral';

export interface Profile {
  id: string;
  status: UserStatus;
  color_theme: string;
  last_active_at: string;
}

export interface Bonfire {
  id: string;
  user_id: string;
  intensity: number;
  message_hash?: string;
  created_at: string;
}
