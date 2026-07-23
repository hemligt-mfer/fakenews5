import Link from "next/link";
import Button from "../button";
import { NewsDropdown } from "./_components/dropdown-menus";
import { Category } from "@/lib/types";
import { SidebarTrigger } from "../ui/sidebar";
import { SearchBar } from "./_components/search-bar";
import { LoginRegButtons } from "./_components/login-register-buttons";

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
      <div className="flex max-w-7xl w-full mx-auto h-15 gap-2 md:px-6 dark:bg-background  bg-background">
        <ul className="flex w-full items-center">
          <li className="lg:hidden">
            <SidebarTrigger size="lg" className="lg:hidden" />
          </li>
          <li className="max-lg:hidden text-lg">
            <NewsDropdown label="News" links={links} />
          </li>
          <li className="max-lg:hidden">
            <Link href="/subscriptions" className="p-2 ">
              <Button
                variant="ghost"
                className=" cursor-pointer border-2 hover:border-b-primary! hover:bg-[#f4ede0]! hover:dark:text-background rounded-b-none text-[16px]"
              >
                Subscriptions
              </Button>
            </Link>
          </li>
          <li className="justify-end ml-auto mr-4">
            <SearchBar />
          </li>
        </ul>
      </div>
  );
}
