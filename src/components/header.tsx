import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";
import Logo from "./logo";

export default async function Header() {
  return (
    <div className="flex justify-between max-lg:gap-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-normal dark:bg-[#2d2d2d] bg-background border-b-3 border-b-primary">
      <div aria-hidden="true" className="hidden lg:block" />

     <Logo />

      <span className="flex items-end justify-end gap-3 pb-3 pr-4">
        <LoginRegButtons />
        <ThemeToggle />
      </span>
    </div>
  );
}
