"use client";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

export function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuButton>
      <Link href={href} onClick={() => setOpenMobile(false)}
      className="text-lg">
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
