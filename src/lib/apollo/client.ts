"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql";

let apolloClient: ApolloClient<any> | null = null;

function createApolloClient() {
  const errorLink = onError((err) => {
    const graphQLErrors = (err as any).graphQLErrors as { message?: string }[] | undefined;
    const networkError = (err as any).networkError as unknown;
    if (graphQLErrors) {
      for (const e of graphQLErrors) {
        if (typeof window !== "undefined" && e?.message && /unauthorized|forbidden/i.test(e.message)) {
          try {
            fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: "mutation{ logout }" }),
              credentials: "include",
            });
          } catch (_) {}
        }
      }
    }
    if (networkError) {
      console.error('Network error:', networkError);
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


