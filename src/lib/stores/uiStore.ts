import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeMode } from '@/types';

interface UIState {
  themeMode: ThemeMode;
  navbarVisible: boolean;
  isSidebarOpen: boolean;
  activeView: 'grid' | 'list';
  isMobileNavOpen: boolean;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setNavbarVisible: (isVisible: boolean) => void;
  setActiveView: (view: 'grid' | 'list') => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (isOpen: boolean) => void;
  
  // Computed
  isDarkMode: () => boolean;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      navbarVisible: true,
      isSidebarOpen: false,
      activeView: 'grid',
      isMobileNavOpen: false,
      
      setThemeMode: (mode) => {
        set({ themeMode: mode });
        
        // Apply theme to document
        const isDark = mode === 'dark' || 
          (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        document.documentElement.classList.toggle('dark', isDark);
      },
      
      toggleTheme: () => {
        const currentMode = get().themeMode;
        const newMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
        get().setThemeMode(newMode);
      },
      
      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
      
      setSidebarOpen: (isOpen) => {
        set({ isSidebarOpen: isOpen });
      },
      
      setNavbarVisible: (isVisible) => {
        set({ navbarVisible: isVisible });
      },
      
      setActiveView: (view) => {
        set({ activeView: view });
      },
      
      toggleMobileNav: () => {
        set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen }));
      },
      
      setMobileNavOpen: (isOpen) => {
        set({ isMobileNavOpen: isOpen });
      },
      
      isDarkMode: () => {
        const { themeMode } = get();
        
        if (themeMode === 'dark') return true;
        if (themeMode === 'light') return false;
        
        // If system, check user preference
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        return false;
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

// Initialize theme on app load
if (typeof window !== 'undefined') {
  const savedState = JSON.parse(localStorage.getItem('ui-store') || '{}');
  const themeMode = savedState?.state?.themeMode || 'system';
  
  const isDark = themeMode === 'dark' || 
    (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  document.documentElement.classList.toggle('dark', isDark);
}