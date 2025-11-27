import { create } from 'zustand';
import Cookies from 'js-cookie';
import { loginAction, registerAction, logoutAction } from '@/actions/auth';

interface User {
    id: string;
    email: string;
    username: string;
    // Add other user properties as needed
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            const result = await loginAction(credentials);

            if (!result.success) {
                throw new Error(result.error);
            }

            set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (data) => {
        set({ isLoading: true });
        try {
            const result = await registerAction(data);

            if (!result.success) {
                throw new Error(result.error);
            }

            set({ user: result.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await logoutAction();
        set({ user: null, isAuthenticated: false });
    },

    hydrate: () => {
        // Since cookies are HTTP-only (mostly), we rely on the 'userData' cookie 
        // which we explicitly set as non-http-only for this purpose, 
        // OR we could fetch from a "me" endpoint.
        // For now, we use the 'userData' cookie approach as per the action implementation.
        const userData = Cookies.get('userData');

        if (userData) {
            try {
                const user = JSON.parse(userData);
                set({ user, isAuthenticated: true, isLoading: false });
            } catch (e) {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
}));
