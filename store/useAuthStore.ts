import { User } from "@/interfaces/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}
 export const useAuthStore = create<AuthStore>()(
   persist(
     (set) => ({
       token: null,
       user: null,

       setAuth: (token, user) => set({ token, user }),
       clearAuth: () => set({ token: null, user: null }),
     }),
     {
       name: "auth-storage", // key in localStorage
     }
   )
 );