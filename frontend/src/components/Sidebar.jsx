import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Image, FolderOpen, Lightbulb, LogOut,
  Menu, X, Sun, Moon,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/generate', icon: FileText, label: 'Script Generator' },
  { path: '/thumbnails', icon: Image, label: 'Thumbnails' },
  { path: '/folders', icon: FolderOpen, label: 'Folders' },
  { path: '/ideas', icon: Lightbulb, label: 'Ideas' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl transition-all active:scale-95"
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 z-40
          transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: 'var(--color-card)', borderRight: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-3 p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg animate-float">
            AR
          </div>
          <div>
            <h1 className="font-bold text-lg">AI Reel Studio</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Creator Platform</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                  active
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                    : 'hover:opacity-80'
                }`}
                style={{ color: active ? undefined : 'var(--color-text-secondary)' }}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="px-4 py-2">
            <button
              onClick={toggle}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ color: 'var(--color-text-secondary)' }}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg transition-all hover:bg-red-600/10 active:scale-90"
                aria-label="Logout"
              >
                <LogOut size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
