"use client";
import Link from "next/link";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  return (
    <div className="flex w-full gap-2 px-6 sticky top-0 bg-muted-foreground">
      <ul className="flex items-center mx-auto">
        <li>
          <Button asChild variant="ghost" className="text-white">
            <Link href="/dashboard/admin">Overview</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="ghost" className="text-white">
            <Link href="/dashboard/admin/articles">Article table</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="ghost" className="text-white">
            <Link  href="/dashboard/admin/users">User table</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}
