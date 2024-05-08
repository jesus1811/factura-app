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
  const [isVertical, setIsVertical] = useState(true);
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

  const handleResize = () => {
    setIsVertical(window.innerHeight > window.innerWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {!isVertical ? (
        <>
          <Component {...pageProps} />
          <Toaster invert duration={2000} />
        </>
      ) : (
        <section className="bg-dark-500 flex  w-full justify-center items-center flex-col-reverse h-screen text-white px-3">
          <Title className="text-center !text-2xl">rote el celular para acceder al sistema</Title>
        </section>
      )}
    </QueryClientProvider>
  );
}
