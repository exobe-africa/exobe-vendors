'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApolloClient } from '@/lib/apollo/client';
import { LOGIN_MUTATION, ME_QUERY } from '@/lib/api/auth';

export type VendorRole = 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  role: VendorRole | 'ADMIN' | 'CUSTOMER';
  token?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

function isVendorRole(role: string | undefined | null): role is VendorRole {
  return role === 'RETAILER' || role === 'WHOLESALER' || role === 'SERVICE_PROVIDER';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      async login(input) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          const { data } = await client.mutate({ mutation: LOGIN_MUTATION, variables: { input } });
          const user = (data as any)?.login as AuthUser | undefined;
          if (!user) throw new Error('Invalid response from server');
          if (!isVendorRole(user.role)) throw new Error('You do not have access to the vendor portal');

          // Persist token for Apollo auth link
          if (typeof window !== 'undefined' && user.token) {
            localStorage.setItem('token', user.token);
          }

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (e: any) {
          set({ error: e?.message || 'Login failed', isAuthenticated: false, user: null, isLoading: false });
          throw e;
        }
      },

      logout() {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, isAuthenticated: false, error: null });
      },

      async fetchMe() {
        try {
          const client = getApolloClient();
          const { data } = await client.query({ query: ME_QUERY, fetchPolicy: 'no-cache' });
          const me = (data as any)?.me as AuthUser | undefined;
          if (me && isVendorRole(me.role)) {
            set({ user: me, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (_) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'exobe-vendor-auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);


