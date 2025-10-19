"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/graphql";

let apolloClient: ApolloClient | null = null;

function createApolloClient() {
  const errorLink = onError((err) => {
    const graphQLErrors = (err as any).graphQLErrors as { message?: string }[] | undefined;
    const networkError = (err as any).networkError as any;

    const hardLogout = () => {
      if (typeof window === 'undefined') return;
      try {
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "mutation{ logout }" }),
          credentials: "include",
        }).catch(() => {});
      } catch (_) {}
      try { localStorage.removeItem('token'); } catch (_) {}
      try { localStorage.removeItem('exobe-vendor-auth'); } catch (_) {}
      try {
        document.cookie = `exobeVendorToken=; Path=/; Max-Age=0; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
        document.cookie = `exobeVendorRole=; Path=/; Max-Age=0; SameSite=Lax` + (location.protocol === 'https:' ? '; Secure' : '');
      } catch (_) {}
      try { if (location.pathname !== '/login') location.href = '/login'; } catch (_) {}
    };
    if (graphQLErrors) {
      for (const e of graphQLErrors) {
        if (typeof window !== "undefined" && e?.message && /(unauthorized|forbidden|not authenticated|jwt|token)/i.test(e.message)) {
          hardLogout();
        }
      }
    }
    if (networkError) {
      const status = (networkError as any)?.statusCode || (networkError as any)?.status || (networkError as any)?.response?.status;
      if (status === 401 || status === 403) {
        hardLogout();
      } else {
        console.error('Network error:', networkError);
      }
    }
  });

  const httpLink = new HttpLink({
    uri: API_URL,
    credentials: "include",
    fetchOptions: { credentials: "include" },
  });

  const authLink = setContext((_, { headers }) => {
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem('exobe-vendor-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          const state = parsed?.state || parsed;
          token = state?.user?.token ?? null;
        }
      } catch (_) {}
      if (!token) {
        try {
          token = localStorage.getItem('token');
        } catch (_) {}
      }
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : headers?.authorization || "",
      },
    };
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function getApolloClient() {
  if (!apolloClient) apolloClient = createApolloClient();
  return apolloClient;
}


