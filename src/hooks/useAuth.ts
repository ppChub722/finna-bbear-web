import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const useAuth = () => {
    const store = useAuthStore();

    useEffect(() => {
        // Hydrate store on mount (client-side)
        store.hydrate();
    }, []);

    return store;
};
