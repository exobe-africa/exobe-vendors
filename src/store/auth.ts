'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApolloClient } from '@/lib/apollo/client';
import { LOGIN_MUTATION, ME_QUERY, REQUEST_PASSWORD_RESET, RESET_PASSWORD } from '@/lib/api/auth';

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
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
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

          if (typeof window !== 'undefined' && user.token) {
            localStorage.setItem('token', user.token);
            try {
              const maxAge = 60 * 60 * 24 * 7; // 7 days
              document.cookie = `exobeVendorToken=${encodeURIComponent(user.token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
              document.cookie = `exobeVendorRole=${encodeURIComponent(user.role)}; Path=/; Max-Age=${maxAge}; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
            } catch (_) {}
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
          try {
            document.cookie = `exobeVendorToken=; Path=/; Max-Age=0; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
            document.cookie = `exobeVendorRole=; Path=/; Max-Age=0; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
          } catch (_) {}
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

      async requestPasswordReset(email: string) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          await client.mutate({
            mutation: REQUEST_PASSWORD_RESET,
            variables: { email },
          });
          set({ isLoading: false });
        } catch (e: any) {
          set({ error: e?.message || 'Failed to send reset email', isLoading: false });
          throw e;
        }
      },

      async resetPassword(token: string, newPassword: string) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          await client.mutate({
            mutation: RESET_PASSWORD,
            variables: { token, newPassword },
          });
          set({ isLoading: false });
        } catch (e: any) {
          set({ error: e?.message || 'Failed to reset password', isLoading: false });
          throw e;
        }
      },

      clearError() {
        set({ error: null });
      },
    }),
    { name: 'exobe-vendor-auth', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);


