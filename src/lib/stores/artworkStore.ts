import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork, ArtworkCategory, FilterOptions, SearchParams, SortOption } from '@/types';

// Mock data - would be replaced with API calls in a real app
import { mockArtworks } from '@/lib/data/mockArtworks';

interface ArtworkState {
  artworks: Artwork[];
  featuredArtworks: Artwork[];
  currentArtwork: Artwork | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  searchQuery: string;
  sortOption: SortOption;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  // Actions
  fetchArtworks: () => Promise<void>;
  fetchFeaturedArtworks: () => Promise<void>;
  fetchArtworkById: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  
  // Computed
  filteredArtworks: () => Artwork[];
}

const defaultFilters: FilterOptions = {
  categories: [],
  formats: [],
  priceRange: [0, 1000],
  tags: [],
  featured: false,
};

export const useArtworkStore = create<ArtworkState>()(
  persist(
    (set, get) => ({
      artworks: [],
      featuredArtworks: [],
      currentArtwork: null,
      isLoading: false,
      error: null,
      filters: defaultFilters,
      searchQuery: '',
      sortOption: 'latest',
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,

      fetchArtworks: async () => {
        set({ isLoading: true, error: null });
        try {
          // This would be an API call in a real application
          // const response = await api.getArtworks(get().searchParams);
          const artworks = mockArtworks;
          
          set({ 
            artworks,
            totalPages: Math.ceil(artworks.length / get().itemsPerPage),
            isLoading: false 
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchFeaturedArtworks: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be a separate API call
          const featured = mockArtworks.filter(artwork => artwork.featured);
          set({ featuredArtworks: featured, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchArtworkById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          const artwork = mockArtworks.find(a => a.id === id) || null;
          
          if (!artwork) {
            throw new Error('Artwork not found');
          }
          
          set({ currentArtwork: artwork, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query, currentPage: 1 });
      },

      setSortOption: (option: SortOption) => {
        set({ sortOption: option, currentPage: 1 });
      },

      setFilters: (filters: Partial<FilterOptions>) => {
        set(state => ({
          filters: {
            ...state.filters,
            ...filters,
          },
          currentPage: 1,
        }));
      },

      resetFilters: () => {
        set({
          filters: defaultFilters,
          searchQuery: '',
          sortOption: 'latest',
          currentPage: 1,
        });
      },

      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      filteredArtworks: () => {
        const {
          artworks,
          filters,
          searchQuery,
          sortOption,
          currentPage,
          itemsPerPage,
        } = get();

        // Apply filters
        let filtered = [...artworks];

        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            artwork =>
              artwork.title.toLowerCase().includes(query) ||
              artwork.description.toLowerCase().includes(query) ||
              artwork.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
          filtered = filtered.filter(artwork =>
            filters.categories?.includes(artwork.category)
          );
        }

        // Format filter
        if (filters.formats && filters.formats.length > 0) {
          filtered = filtered.filter(artwork =>
            filters.formats?.includes(artwork.format)
          );
        }

        // Price range filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange;
          filtered = filtered.filter(
            artwork => artwork.price >= min && artwork.price <= max
          );
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter(artwork =>
            filters.tags?.some(tag => artwork.tags.includes(tag))
          );
        }

        // Featured filter
        if (filters.featured) {
          filtered = filtered.filter(artwork => artwork.featured);
        }

        // Apply sorting
        switch (sortOption) {
          case 'latest':
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'oldest':
            filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'popular':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          default:
            break;
        }

        // Update total pages
        set({ totalPages: Math.ceil(filtered.length / itemsPerPage) });

        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filtered.slice(startIndex, endIndex);
      },
    }),
    {
      name: 'artwork-store',
      partialize: (state) => ({
        filters: state.filters,
        sortOption: state.sortOption,
        currentPage: state.currentPage,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);