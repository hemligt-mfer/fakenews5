"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function EditorNavbar() {
  return (
    <div className="flex w-full gap-2 px-6 sticky top-0 bg-muted-foreground dark:bg-muted">
      <ul className="flex items-center mx-auto">
        <li>
          <Button asChild variant="ghost" className="text-white">
            <Link href="/dashboard/admin/articles">Article table</Link>
          </Button>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                Editor tools
                <ChevronDown color="white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/article/add-article">Create article</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/admin/articles">Edit articles</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </div>
  );
}
