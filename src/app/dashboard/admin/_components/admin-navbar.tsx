"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";




export default function AdminNavbar() {
  return (
    
      <div className="flex w-full gap-2 px-6 sticky top-0 bg-muted-foreground">
        <ul className="flex items-center mx-auto">
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  User control
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
                <Link href="/">Article table</Link>
            </Button>
          </li>
        </ul>

       
      </div>
  );
}