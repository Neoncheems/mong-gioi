import { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { T } from '../utils/strings';
import { useAuth } from '../store/useAuth';
import { supabase } from '../lib/supabase';
import { LogOut, User } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, initAuth } = useAuth();

  useEffect(() => {
    initAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
      <header className="bg-bg-2 border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-accent">
            {T.appName}
          </Link>
          <nav className="flex gap-4 items-center">
            <Link 
              to="/" 
              className={`hover:text-accent transition-colors ${location.pathname === '/' ? 'text-accent font-semibold' : 'text-text-2'}`}
            >
              Trang chủ
            </Link>
            <Link 
              to="/settings" 
              className={`hover:text-accent transition-colors ${location.pathname === '/settings' ? 'text-accent font-semibold' : 'text-text-2'}`}
            >
              Cài đặt
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
                <span className="text-sm text-text-2 flex items-center gap-1">
                  <User size={14} /> {user.email?.split('@')[0]}
                </span>
                <button onClick={handleLogout} className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors" title="Đăng xuất">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-accent text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-accent-2 transition-colors ml-2">
                Đăng nhập
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}