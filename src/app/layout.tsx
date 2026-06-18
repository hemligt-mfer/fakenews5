import type { Metadata } from "next";
import { Anuphan, Lora, Roboto_Mono, Gelasio } from "next/font/google";
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
import { getCategories } from "@/_actions/category-actions";
import EditorNavbar from "./dashboard/admin/_components/editor-navbar";
import AdBanner from "@/components/ad-banner";
import { userIsAdFree } from "@/lib/ads";

const fontSans = Anuphan({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontSerif = Gelasio({
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
    let editor = false

    if (session != null) {
        const res = await auth.api.userHasPermission({
            body: {
                userId: session.user.id,
                permissions: { article: ["create", "update", "delete"] },
            },
            headers: await headers(),
        });
        if (res?.success && session.user.role === "admin") {
            hasPermission = true;
        }
    }
    if(session?.user.role === "editor"){
        editor = true
    }

    const cats = await getCategories();
    const adFree = await userIsAdFree();

    return (
        <html
            lang="en"
            data-theme="light"
            className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}
            suppressHydrationWarning
        >
            <head>
                {/* Prevents flash of wrong theme on load */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme',t);}catch(_){}})();`,
                    }}
                />
            </head>
            <body className="flex flex-col">
                <div className="sticky top-0 z-50">
                    <Header />
                    <Navbar categories={cats.success && cats.data ? cats.data : null} />
                    {hasPermission && <AdminNavbar />}
                    {editor && <EditorNavbar />}
                </div>

                {!adFree && <AdBanner />}

                <div className="flex min-h-screen lg:min-w-5xl max-w-6xl shadow-2xl border-x border-gray-500/50 flex-1 mx-auto">
                    <SidebarProvider
                        defaultOpen={false}
                        style={
                            {
                                "--sidebar-width-mobile": "20rem",
                            } as React.CSSProperties
                        }
                    >
                        <AppSidebar categories={cats.success && cats.data ? cats.data : null} />

                        <main className="flex max-w-6xl lg:min-w-5xl">
                            <SidebarTrigger size="lg" className="lg:hidden" />
                            {children}
                        </main>
                        <Toaster />
                    </SidebarProvider>
                </div>
                {!adFree && <AdBanner />}
                <Footer />
            </body>
        </html>
    );
}
