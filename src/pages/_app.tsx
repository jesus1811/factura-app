import { useThemeStore } from "@/store";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const { theme } = useThemeStore();
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
    document.documentElement.style.setProperty("--color-primary-500", theme?.primaryColor);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Component {...pageProps} />
        <Toaster invert duration={2000} />
      </>
    </QueryClientProvider>
  );
}
