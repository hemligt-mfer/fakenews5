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
import {NewsPages} from "./_components/dropdown-menus"

export default function Navbar() {
  return (
    <div className="flex w-full">
      <div className="hidden lg:flex w-full items-center gap-2 px-6  sticky top-0 z-50 bg-[#2d2d2d]">
        <ul className="flex items-center mx-auto">
          <li>
            <Button variant="ghost" className="text-white" asChild>
              <Link href="/">Home</Link>
            </Button>
          </li>
          <li>
            <NewsDropdown label="News" links={NewsPages}/>
          </li>
          <li>
            <NewsDropdown label="Sports" links={SportPages}/>
          </li>
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
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/api/auth/register">Register</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/api/auth/signin">Sign in</Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
