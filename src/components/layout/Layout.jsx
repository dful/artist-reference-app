import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useThemeInit } from '../../stores';

export const Layout = () => {
  // Initialize theme on app load
  useThemeInit();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
    </div>
  );
};
