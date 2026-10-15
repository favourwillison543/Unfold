"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep fetched data fresh for 5 minutes.
            staleTime: 5 * 60 * 1000,

            // Don't refetch just because the browser window gets focus again.
            refetchOnWindowFocus: false,

            // Don't refetch every time a component using the query mounts.
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}