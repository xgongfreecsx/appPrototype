import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork, CartItem, ArtworkLicense } from '@/types';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  
  // Actions
  addToCart: (artwork: Artwork, licenseType: ArtworkLicense['type']) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Computed
  totalItems: () => number;
  totalPrice: () => number;
  hasItems: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      addToCart: (artwork, licenseType) => {
        const { items } = get();
        
        // Find the license price
        const license = artwork.licenses.find(l => l.type === licenseType);
        if (!license) return;
        
        const itemPrice = license.price;
        
        // Check if item already exists in cart with the same license
        const existingItemIndex = items.findIndex(
          item => item.artwork.id === artwork.id && item.licenseType === licenseType
        );
        
        if (existingItemIndex > -1) {
          // Update quantity if item already exists
          set({
            items: items.map((item, idx) =>
              idx === existingItemIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: `${artwork.id}-${licenseType}-${Date.now()}`,
            artwork,
            licenseType,
            price: itemPrice,
            quantity: 1,
          };
          
          set({ items: [...items, newItem] });
        }
      },
      
      removeFromCart: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      toggleCart: () => {
        set(state => ({ isCartOpen: !state.isCartOpen }));
      },
      
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      hasItems: () => {
        return get().items.length > 0;
      },
    }),
    {
      name: 'cart-store',
    }
  )
);