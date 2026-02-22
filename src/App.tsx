import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Auth } from '@/components/Auth';
import { Canvas } from '@/components/Canvas';
import { Toolbar } from '@/components/Toolbar';
import { OrganizeButton } from '@/components/OrganizeButton';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 text-white relative">
      <Canvas />
      <Toolbar />
      <OrganizeButton />
      
      {/* User Info / Sign Out (Simple absolute positioning for MVP) */}
      <div className="fixed top-6 left-6 z-50">
        <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-full pl-1 pr-4 py-1">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
             {session.user.email?.charAt(0).toUpperCase()}
           </div>
           <span className="text-xs text-zinc-400 max-w-[100px] truncate">{session.user.email}</span>
           <button 
             onClick={() => supabase.auth.signOut()}
             className="text-xs text-red-400 hover:text-red-300 ml-2"
           >
             Sign Out
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;
