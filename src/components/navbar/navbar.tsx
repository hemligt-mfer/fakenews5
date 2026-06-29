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
    <div>
      <div className="flex w-full  h-15 gap-2 md:px-6 dark:bg-background  bg-background">
        <ul className="flex justify-start! [1300px]:w-3/4 xl:mx-auto my-auto w-full">
          <li className="lg:hidden">
            <SidebarTrigger size="lg" className="lg:hidden" />
          </li>
          <li className="max-lg:hidden my-auto text-lg">
            <NewsDropdown label="News" links={links} />
          </li>
          <li className="max-lg:hidden my-auto">
            <Link href="/subscriptions" className="p-2 ">
              <Button
                variant="ghost"
                className=" cursor-pointer border-2 hover:border-b-primary! hover:bg-[#f4ede0]! hover:dark:text-background rounded-b-none text-[16px]"
              >
                Subscriptions
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
