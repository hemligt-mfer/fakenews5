"use client";
import {
  NewsDropdown,
  SportPages,
  NewsPages,
} from "./_components/dropdown-menus";

export default function Navbar() {
  return (
    <div className="flex">
      <div className="hidden lg:flex w-full items-center gap-2 px-6 bg-[#2d2d2d]">
        <ul className="flex items-center mx-auto">
          <li>
            <NewsDropdown label="News" links={NewsPages} />
          </li>
          <li>
            <NewsDropdown label="Sports" links={SportPages} />
          </li>
        </ul>
      </div>
    </div>
  );
}
