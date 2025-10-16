import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwtDecode from 'jwt-decode';

type JwtPayload = { role?: string };

export default function Layout({ children }: { children: React.ReactNode }) {
  // Simple server-side guard using token in localStorage is not available on server.
  // For SSR protection, expect token to be present in a cookie if you later set it server-side.
  // Fallback: allow render; client guard will redirect if unauthorized.
  return <DashboardLayout>{children}</DashboardLayout>;
}

