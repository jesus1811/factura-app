import "@/styles/globals.css";
import { hasContrast } from "@/utilities";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })
  );
  useEffect(() => {
    const storedColor = localStorage.getItem("color-primary") || "#5a57ee";
    if (storedColor && hasContrast("#020202", storedColor)) {
      document.documentElement.style.setProperty("--color-primary-500", storedColor);
    } else {
      document.documentElement.style.setProperty("--color-primary-500", storedColor);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Component {...pageProps} />
        <Toaster invert duration={2000} />
      </>
    </QueryClientProvider>
  );
}
