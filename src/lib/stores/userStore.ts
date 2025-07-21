import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Order, Artwork } from '@/types';

// Mock data - would be replaced with API calls in a real app
import { mockUsers } from '@/lib/data/mockUsers';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  orders: Order[];
  wishlist: Artwork[];
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Profile actions
  updateProfile: (userData: Partial<User>) => Promise<void>;
  
  // Orders actions
  fetchOrders: () => Promise<void>;
  
  // Wishlist actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (artwork: Artwork) => Promise<void>;
  removeFromWishlist: (artworkId: string) => Promise<void>;
  isInWishlist: (artworkId: string) => boolean;
  toggleWishlist: (artwork: Artwork) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,
      orders: [],
      wishlist: [],
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // const response = await api.login(email, password);
          
          // Mock authentication
          const foundUser = mockUsers.find(user => user.email === email);
          if (!foundUser) {
            throw new Error('Invalid credentials');
          }
          
          // In a real app, we'd validate the password properly
          // For mock purposes, we're just checking if user exists
          
          set({
            user: foundUser,
            isLoggedIn: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // const response = await api.register(username, email, password);
          
          // Mock registration
          // Check if email already exists
          const userExists = mockUsers.some(user => user.email === email);
          if (userExists) {
            throw new Error('Email already in use');
          }
          
          // Create new user
          const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            role: 'user',
            createdAt: new Date(),
          };
          
          // In a real app, this would be handled by the backend
          
          set({
            user: newUser,
            isLoggedIn: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          orders: [],
          wishlist: [],
        });
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // const response = await api.updateProfile(userData);
          
          const currentUser = get().user;
          if (!currentUser) {
            throw new Error('User not authenticated');
          }
          
          // Update user data
          const updatedUser = {
            ...currentUser,
            ...userData,
          };
          
          // In a real app, this would be handled by the backend
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // const response = await api.getOrders();
          
          // Mock orders - would be fetched from API
          const orders: Order[] = [];
          
          set({
            orders,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // const response = await api.getWishlist();
          
          // Mock wishlist - would be fetched from API
          const wishlist: Artwork[] = [];
          
          set({
            wishlist,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      addToWishlist: async (artwork) => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // await api.addToWishlist(artworkId);
          
          const { wishlist } = get();
          const updatedWishlist = [...wishlist, artwork];
          
          set({
            wishlist: updatedWishlist,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      removeFromWishlist: async (artworkId) => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real app
          // await api.removeFromWishlist(artworkId);
          
          const { wishlist } = get();
          const updatedWishlist = wishlist.filter(item => item.id !== artworkId);
          
          set({
            wishlist: updatedWishlist,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            isLoading: false,
          });
        }
      },
      
      isInWishlist: (artworkId) => {
        const { wishlist } = get();
        return wishlist.some(item => item.id === artworkId);
      },
      
      toggleWishlist: async (artwork) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        
        if (isInWishlist(artwork.id)) {
          await removeFromWishlist(artwork.id);
        } else {
          await addToWishlist(artwork);
        }
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);