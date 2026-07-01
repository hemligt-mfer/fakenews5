"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PanelLeft,
  User,
  Lock,
  ChartColumn,
  Bookmark,
  CreditCard,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Profile dashboard", href: "/dashboard/profile/", icon: Home },
  { label: "User settings", href: "/dashboard/profile/settings", icon: User },
  {
    label: "Email & password",
    href: "/dashboard/profile/security",
    icon: Lock,
  },
  {
    label: "Analytics",
    href: "/dashboard/profile/analytics",
    icon: ChartColumn,
  },
  {
    label: "Saved articles",
    href: "/dashboard/profile/saved-articles",
    icon: Bookmark,
  },
  { label: "Subscription", href: "/dashboard/profile/sub", icon: CreditCard },
];

export default function ProfileSidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-muted-foreground/50 transition-all duration-200 ",
        open ? "w-60" : "w-14",
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center px-2",
          open ? "justify-end" : "justify-center",
        )}
      >
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle sidebar"
          className="rounded-md p-2 text-background hover:bg-muted hover:text-foreground"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={!open ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                open ? "justify-start" : "justify-center",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-background hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
