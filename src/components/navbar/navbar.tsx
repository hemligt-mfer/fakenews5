"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { NewsDropdown, SportPages } from "./_components/dropdown-menus";
import { NewsPages } from "./_components/dropdown-menus";
import { authClient } from "@/lib/auth-client";

const session = await authClient.getSession();
let hasPermission = false;
if (session && session.data != null) {
  const res = await authClient.admin.hasPermission({
    userId: session.data?.user.id,
    permissions: { article: ["create", "update", "delete"] },
  });
  if (res.data?.success) {
    hasPermission = true;
  }
  console.log(res);
  console.log(hasPermission);
}

export default function Navbar() {
  return (
    <div className="flex w-full">
      <div className="hidden lg:flex w-full items-center gap-2 px-6 bg-[#2d2d2d]">
        <ul className="flex items-center mx-auto">
          <li>
            <NewsDropdown label="News" links={NewsPages} />
          </li>
          <li>
            <NewsDropdown label="Sports" links={SportPages} />
          </li>
          {hasPermission ? (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    Author/Editor/Admin
                    <ChevronDown color="white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link href="/article/add-article">Create article</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </div>
  );
}
