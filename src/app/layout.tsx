import type { Metadata } from "next";
import { Anuphan, Geist, Geist_Mono, Lora, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navbar/_components/app-sidebar";
import { Toaster } from "sonner";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}
      suppressHydrationWarning
    >
      <body>
        <Header />
        <Navbar />
        
          <SidebarProvider
            suppressHydrationWarning
            defaultOpen={false}
            style={
              {
                "--sidebar-width-mobile": "20rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <main className="flex mx-auto w-full max-w-5xl shadow-2xl">
              <SidebarTrigger size="lg" className="lg:hidden" />
              {children}
            </main>
            <Toaster />
          </SidebarProvider>
       

                <Footer />
            </body>
        </html>
    );
}
