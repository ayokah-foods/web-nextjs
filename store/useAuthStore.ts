import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/interfaces/user";

interface AuthStore {
  token: string | null;
  user: User | null;
  _hasHydrated: boolean; // Add this state
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void; // Add this setter
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      _hasHydrated: false, // Initialize as false

      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }), // Implement the setter
    }),
    {
      name: "auth-storage",
      // ... (Your existing storage and partialize config remains the same)
      onRehydrateStorage: () => (state) => {
        // Called when rehydration is complete
        state?.setHasHydrated(true);
      },
      // IMPORTANT: Remove the custom storage wrapper you made.
      // The default createJSONStorage(localStorage) already handles SSR by throwing.
      // Zustand's persist catches the error and avoids calling localStorage on the server.
      // Your custom wrapper might be causing issues. Use the standard setup:
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;

        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),

      partialize: (state) =>
        ({
          token: state.token,
          user: state.user,
        } as AuthStore),
    }
  )
);
