
"use client";
import Link from "next/link";
import Button from "../button";
import { NewsDropdown } from "./_components/dropdown-menus";
import { Category } from "@/lib/types";
import { SearchBar } from "./_components/search-bar";

export default function Navbar({ categories }: { categories: Category[] | null }) {
    const links = [];
    if (categories) {
        for (const c of categories) {
            links.push({ title: c.name, href: `/category/${c.id}` });
        }
    }
    return (
        <div className="flex">
            <div className="hidden lg:flex w-full items-center gap-2 px-6 dark:bg-[#2d2d2d]  bg-background">
                <ul className="flex justify-start w-5xl mx-auto">
                    <li>
                        <NewsDropdown label="News" links={links} />
                    </li>
                    <li>
                        <Link href="/marketplace">
                            <Button variant="ghost" className="cursor-pointer">
                                Marketplace
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/subscriptions">
                            <Button variant="ghost" className="cursor-pointer">
                                Subscriptions
                            </Button>
                        </Link>
                    </li>
                    <li className="ml-auto my-auto"><SearchBar/></li>
                </ul>
            </div>
        </div>
    );
}

