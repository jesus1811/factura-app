import { useTokenStore } from "@/store";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  const { loadStore, token } = useTokenStore();
  const pathname = usePathname();
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
  const router = useRouter();
  useEffect(() => {
    loadStore();
  }, []);

  useEffect(() => {
    if (token?.isLoading) return;
    if (!token?.value) {
      router.push("/login");
    }
    if (pathname === "/login" && token?.value) {
      router.push("/");
    }
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <h1>{JSON.stringify(pathname === "/login")}</h1> */}
      <Component {...pageProps} />
      <Toaster invert duration={2000} />
    </QueryClientProvider>
  );
}
