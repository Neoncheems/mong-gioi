import { Link, Outlet, useLocation } from 'react-router-dom';
import { T } from '../utils/strings';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans">
      {/* Thanh Header */}
      <header className="bg-bg-2 border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-accent">
            {T.appName}
          </Link>
          <nav className="flex gap-4">
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
          </nav>
        </div>
      </header>

      {/* Nội dung trang */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}