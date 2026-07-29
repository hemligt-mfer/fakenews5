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

export default function AdminNavbar() {
    return (
        <div className="flex flex-wrap gap-2 px-6 sticky top-0 bg-chart-5 dark:bg-muted border-b border-primary py-2">
            <ul className="flex flex-wrap items-center mx-auto">
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin">Overview</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin/articles">Article table</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin/categories">Category table</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin/users">User table</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin/plans">Plans</Link>
                    </Button>
                </li>
                <li>
                    <Button asChild variant="ghost" className="dark:hover:bg-primary dark:hover:text-black">
                        <Link href="/dashboard/admin/advertisements">Ads</Link>
                    </Button>
                </li>
                <li>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="cursor-pointer dark:hover:bg-primary dark:hover:text-black">
                                Editor tools
                                <ChevronDown className=" dark:hover:bg-primary dark:hover:text-black" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="dark:focus:**:text-black dark:focus:bg-primary">
                                <Link href="/article/add-article">Create article</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:focus:**:text-black dark:focus:bg-primary">
                                <Link href="/dashboard/admin/articles">Edit articles</Link>
                            </DropdownMenuItem>
                           <DropdownMenuItem className="dark:focus:**:text-black dark:focus:bg-primary">
                                <Link href="/dashboard/admin/ai">AI Helper</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </li>
            </ul>
        </div>
    );
}
