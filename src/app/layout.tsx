import type { Metadata } from "next";
import { Anuphan, Lora, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navbar/_components/app-sidebar";
import { Toaster } from "sonner";
import AdminNavbar from "./dashboard/admin/_components/admin-navbar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const fontSans = Anuphan({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Fakenews",
  description: "A news website.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let hasPermission = false;

  if (session != null) {
    const res = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: { article: ["create", "update", "delete"] },
      },
      headers: await headers(),
    });
    if (res?.success) {
      hasPermission = true;
    }
  }

  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevents flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme',t);}catch(_){}})();` }} />
      </head>
      <body className="flex flex-col bg-gray-200 dark:bg-gray-900">
        <div className="sticky top-0 z-50">
          <Header />
          <Navbar />
          {hasPermission && <AdminNavbar />}
        </div>
        <div className="flex min-h-screen lg:min-w-5xl max-w-6xl shadow-2xl border-x border-gray-500 flex-1 mx-auto bg-white">
          <SidebarProvider
            defaultOpen={false}
            style={
              {
                "--sidebar-width-mobile": "20rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <main className="flex max-w-6xl lg:min-w-5xl">
              <SidebarTrigger size="lg" className="lg:hidden" />
              {children}
            </main>
          </SidebarProvider>
        </div>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
