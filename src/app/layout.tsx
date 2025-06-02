import AuthHeader from "@/features/auth/header";
import { ThemeProvider } from "@/features/theme/theme-provider";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <header className="flex flex-row border-b dark:border-zinc-700 border-zinc-200 justify-between w-full h-16 items-center ">
            <nav>
              <ul className="flex flex-row gap-10 p-1 items-center">
                <li>
                  <Link className="text-2xl" href="/">
                    🌦️
                  </Link>
                </li>
                <li>
                  <Link href="/post">Post</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
              </ul>
            </nav>
            <AuthHeader />
          </header>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ToastContainer position="bottom-center" />
            <main className="max-w-160 w-full mx-auto">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
