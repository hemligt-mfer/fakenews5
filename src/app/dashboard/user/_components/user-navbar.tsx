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




export default function UserNavbar() {
  return (
    
      <div className="flex w-full gap-2 px-6 sticky top-0 bg-muted-foreground">
        <ul className="flex items-center mx-auto">
          <li>
            <Button asChild variant="ghost" className="text-white">
                <Link href="/dashboard">Overview</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
                <Link href="/dashboard/settings">Settings</Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
                <Link href="/dashboard/sub">Subscribtion</Link>
            </Button>
          </li>
        </ul>

       
      </div>
  );
}