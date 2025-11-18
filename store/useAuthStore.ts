import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/interfaces/user";

interface AuthStore {
  token: string | null;
  user: User | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void;
  updateUser: (user: Partial<User>) => void; // new method
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      _hasHydrated: false,

      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      updateUser: (userUpdate: Partial<User>) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...userUpdate }
            : ({ ...userUpdate } as User),
        })),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
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
