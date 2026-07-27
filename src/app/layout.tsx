import type { Metadata } from "next";
import { Anuphan, Roboto_Mono, Gelasio } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navbar/_components/app-sidebar";
import { Toaster } from "sonner";
import AdminNavbar from "./dashboard/admin/_components/admin-navbar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getCategories } from "@/_actions/category-actions";
import EditorNavbar from "./dashboard/admin/_components/editor-navbar";
import AdBanner from "@/components/ad-banner";
import ScrollAwareNav from "@/components/navbar/_components/scroll-aware-nav";
import { getViewerContext } from "@/lib/access";
import { SearchBar } from "@/components/navbar/_components/search-bar";
import { CookieBanner } from "./cookies/cookie-banner";
import { getConsent } from "@/lib/cookie-actions";

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
    title: "The Daily Commit",
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
    let editor = false;

    //  if (session != null) {
    //    const res = await auth.api.userHasPermission({
    //      body: {
    //        userId: session.user.id,
    //      permissions: { article: ["create", "update", "delete"] },
    // },
    // headers: await headers(),
    // });
    // if (res?.success) {
    //   hasPermission = true;
    // }
    // }
    if (session?.user.role === "editor") {
        editor = true;
    }
    if (session?.user.role === "admin") {
        hasPermission = true;
    }

    const cats = await getCategories();

    let showAds = true;
    const viewerContext = await getViewerContext(await headers());
    if (!viewerContext.showsAds) showAds = false;

    let showCookieBanner;
    const cookieConsent = await getConsent();
    if (cookieConsent === undefined) {
        showCookieBanner = true;
    } else if (cookieConsent.value === "yes") {
        showCookieBanner = false;
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
                {/* <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme',t);}catch(_){}})();`,
                    }}
                /> */}
            </head>

            <body className="flex flex-col  bg-background dark:bg-background">
                {showCookieBanner ? <CookieBanner /> : ""}
                <SidebarProvider
                    className="flex flex-col"
                    defaultOpen={false}
                    style={
                        {
                            "--sidebar-width-mobile": "20rem",
                        } as React.CSSProperties
                    }
                >
                    <div className="sticky top-0 z-50">
                        <div className="relative z-20">
                            <Header />
                        </div>
                        <ScrollAwareNav>
                            <div className="flex justify-between bg-background">
                                <Navbar categories={cats.success && cats.data ? cats.data : null} />
                                <div className="flex gap-4">
                                    <div className="my-auto">
                                        
                                    </div>
                                </div>
                            </div>
                            {hasPermission && <AdminNavbar />}
                            {editor && <EditorNavbar />}
                        </ScrollAwareNav>
                    </div>

                    {showAds && <AdBanner slot="top" />}

                    <div className="  min-h-screen w-full mx-auto md:max-w-6xl bg-background dark:bg-muted border-x border-gray-500/50 flex-1 ">
                        <AppSidebar categories={cats.success && cats.data ? cats.data : null} />
                        <main className=" max-w-6xl lg:min-w-5xl">{children}</main>
                        <Toaster />
                    </div>
                    {showAds && <AdBanner slot="bottom" />}
                    <Footer />
                </SidebarProvider>
            </body>
        </html>
    );
}
