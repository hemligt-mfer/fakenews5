"use client";
import Link from "next/link";
import Button from "../button";
import { NewsDropdown } from "./_components/dropdown-menus";
import { Category } from "@/lib/types";
import { SearchBar } from "./_components/search-bar";
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "./_components/app-sidebar";

export default function Navbar({
  categories,
}: {
  categories: Category[] | null;
}) {
  const links = [];
  if (categories) {
    for (const c of categories) {
      links.push({ title: c.name, href: `/category/${c.id}` });
    }
  }
  return (
    <div className="flex">
      <div className="flex w-full items-center h-8 gap-2 px-6 dark:bg-background  bg-background">
        <ul className="flex justify-start w-5xl mx-auto">
          <li className="lg:hidden">
            {" "}
            <SidebarTrigger size="lg" className="lg:hidden" />
          </li>
          <li className="max-lg:hidden my-auto">
            <NewsDropdown label="News" links={links} />
          </li>
          <li className="max-lg:hidden my-auto">
            <Link href="/marketplace">
              <Button variant="ghost" className="h-6  cursor-pointer">
                Marketplace
              </Button>
            </Link>
          </li>
          <li className="max-lg:hidden my-auto">
            <Link href="/subscriptions">
              <Button variant="ghost" className="h-6 cursor-pointer">
                Subscriptions
              </Button>
            </Link>
          </li>
          <li className="ml-auto my-auto">
            <SearchBar />
          </li>
        </ul>
      </div>
    </div>
  );
}
