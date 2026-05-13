import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Sidebar from './Sidebar';

function PageTransition() {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('animate-fade-in');
    void el.offsetWidth;
    el.classList.add('animate-fade-in');
  }, [pathname]);

  return (
    <div ref={ref} className="animate-fade-in w-full">
      <Outlet />
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <PageTransition />
        </div>
      </main>
    </div>
  );
}
