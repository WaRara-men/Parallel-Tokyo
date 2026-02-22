import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Auth } from '@/components/Auth';
import { PresenceMap } from '@/components/PresenceMap';
import { BonfireInput } from '@/components/BonfireInput';
import { useCanvasStore } from '@/store/canvasStore';
import { UserStatus } from '@/types';
import { Settings } from 'lucide-react';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const updateStatus = useCanvasStore((state) => state.updateStatus);
  const currentUserStatus = useCanvasStore((state) => state.currentUserStatus);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-zinc-500 font-light tracking-widest">
        LOADING SILENCE...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const statuses: UserStatus[] = ['tired', 'melancholy', 'anxious', 'calm', 'neutral'];

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white relative">
      <PresenceMap />
      <BonfireInput />
      
      {/* Status Selector */}
      <div className="fixed top-8 left-8 z-30">
        <button 
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColorDot(currentUserStatus)}`} />
          <span className="text-xs tracking-widest uppercase">{currentUserStatus}</span>
          <Settings size={14} className="opacity-50" />
        </button>

        {showStatusMenu && (
          <div className="absolute top-8 left-0 mt-2 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg p-2 flex flex-col gap-1 min-w-[140px]">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  updateStatus(status);
                  setShowStatusMenu(false);
                }}
                className={`text-left px-3 py-2 text-xs uppercase tracking-wider rounded hover:bg-zinc-800 transition-colors ${currentUserStatus === status ? 'text-white' : 'text-zinc-500'}`}
              >
                {status}
              </button>
            ))}
            <div className="h-px bg-zinc-800 my-1" />
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-left px-3 py-2 text-xs uppercase tracking-wider text-red-900 hover:text-red-500 hover:bg-red-900/10 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const getStatusColorDot = (status: UserStatus) => {
  switch (status) {
    case 'tired': return 'bg-blue-900 shadow-[0_0_10px_rgba(30,58,138,0.8)]';
    case 'melancholy': return 'bg-purple-900 shadow-[0_0_10px_rgba(88,28,135,0.8)]';
    case 'anxious': return 'bg-red-900 shadow-[0_0_10px_rgba(127,29,29,0.8)]';
    case 'calm': return 'bg-emerald-900 shadow-[0_0_10px_rgba(6,78,59,0.8)]';
    default: return 'bg-zinc-600';
  }
};

export default App;
