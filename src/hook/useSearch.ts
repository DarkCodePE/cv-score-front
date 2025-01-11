// hooks/useSearch.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useRouter } from 'next/navigation';
import { SearchFilters, SearchState, SearchResponse, Job } from '@/types/search';
import {searchService} from "@/service/search";


const initialState: SearchState = {
    searchTerm: '',
    location: '',
    filters: {},
    results: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalResults: 0,
    totalPages: 0
};

export const useSearchStore = create<SearchState & {
    setSearchTerm: (term: string) => void;
    setLocation: (location: string) => void;
    setFilters: (filters: SearchFilters) => void;
    setResults: (results: Job[], total: number, page: number, totalPages: number) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    resetSearch: () => void;
    clearSearch: () => void; // Reintroducir clearSearch
}>()(
    persist(
        (set) => ({
            ...initialState,
            setSearchTerm: (searchTerm) => set({ searchTerm }),
            setLocation: (location) => set({ location }),
            setFilters: (filters) => set({ filters }),
            setResults: (results, total, page, totalPages) => set({
                results,
                totalResults: total,
                currentPage: page,
                totalPages
            }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            resetSearch: () => set(initialState),
            clearSearch: () => set({
                searchTerm: '',
                location: '',
                filters: {},
                results: [],
                currentPage: 1,
                totalResults: 0,
                totalPages: 0,
            })
        }),
        {
            name: 'search-store',
            partialize: (state) => ({
                searchTerm: state.searchTerm,
                location: state.location,
                filters: state.filters
            })
        }
    )
);

export const useSearch = () => {
    const router = useRouter();
    const store = useSearchStore();

    const performSearch = async (
        term: string,
        loc: string,
        filters: SearchFilters = {},
        page = 1
    ) => {
        store.setIsLoading(true);
        store.setError(null);

        try {
            const response = await searchService.searchJobs(term, loc, filters, page);
            store.setResults(
                response.jobs,
                response.total,
                response.page,
                response.totalPages
            );
        } catch (error) {
            store.setError('Error al realizar la búsqueda');
            console.error('Search error:', error);
        } finally {
            store.setIsLoading(false);
        }
    };

    const handleSearch = async (term: string, loc: string, filters?: SearchFilters) => {
        store.setSearchTerm(term);
        store.setLocation(loc);
        if (filters) {
            store.setFilters(filters);
        }

        const params = new URLSearchParams();
        if (term) params.append('q', term);
        if (loc) params.append('location', loc);

        await performSearch(term, loc, filters);
        router.push(`/search?${params.toString()}`);
    };

    return {
        ...store,
        handleSearch,
        performSearch,
        clearSearch: store.clearSearch
    };
};