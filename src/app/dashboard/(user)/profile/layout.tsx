import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  User,
  Lock,
  ChartColumn,
  Bookmark,
  CreditCard,
  Home,
} from "lucide-react";
import ProfileSidebar, { type ProfileNavItem } from "./_components/sidebar";

async function getSavedArticlesCount(userId: string) {
  try {
    return await prisma.bookmark.count({ where: { user: { userId } } });
  } catch {
    return 0;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const savedArticles = session?.user.id
    ? await getSavedArticlesCount(session.user.id)
    : 0;

  const iconClass = "h-5 w-5 shrink-0 ";
  const items: ProfileNavItem[] = [
    {
      label: "Profile dashboard",
      href: "/dashboard/profile",
      icon: <Home className={iconClass} />,
    },
    {
      label: "User settings",
      href: "/dashboard/profile/settings",
      icon: <User className={iconClass} />,
    },
    {
      label: "Email & password",
      href: "/dashboard/profile/security",
      icon: <Lock className={iconClass} />,
    },
    {
      label: "Analytics",
      href: "/dashboard/profile/analytics",
      icon: <ChartColumn className={iconClass} />,
    },
    {
      label: "Saved articles",
      href: "/dashboard/profile/saved-articles",
      icon: <Bookmark className={iconClass} />,
      badge: savedArticles,
    },
    {
      label: "Subscription",
      href: "/dashboard/profile/sub",
      icon: <CreditCard className={iconClass} />,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex min-h-screen">
        <ProfileSidebar items={items} />
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </div>
    </div>
  );
}
