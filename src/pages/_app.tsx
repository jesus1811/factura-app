import { Title } from "@/components/atoms";
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
  const [isVertical, setIsVertical] = useState(false);
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

  const handleOrientationChange = () => {
    if (window.orientation === 90 || window.orientation === -90) {
      setIsVertical(true);
    } else {
      setIsVertical(false);
    }
  };

  useEffect(() => {
    handleOrientationChange();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <h1> debug isVertical {JSON.stringify(isVertical)}</h1>
      {!isVertical ? (
        <>
          <Component {...pageProps} />
          <Toaster invert duration={2000} />
        </>
      ) : (
        <section className="bg-dark-500 flex bg w-full justify-center items-center flex-col-reverse h-screen text-white">
          <Title>rote el celular para acceder al sistema</Title>
        </section>
      )}
    </QueryClientProvider>
  );
}
