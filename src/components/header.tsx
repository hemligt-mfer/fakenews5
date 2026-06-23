import Image from "next/image";
import Link from "next/link";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className="flex justify-between dark:bg-[#2d2d2d]  bg-background border-b-5 border-b-primary">
        <div className="flex md:hidden"><Image src={"/logo.svg"} width={90} height={90} alt="Logo" priority /></div>
      <div className="hidden md:flex w-full text-center p-5  mx-auto justify-center">
        <Link href="/">
          <div className="flex">
            <Image src={"/fn_logo.svg"} width={90} height={90} alt="Logo" priority />
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-4xl text-shadow-xs  md:text-5xl">
                Fakenews5
              </h1>
              <h2 className="text-primary text-sm uppercase mr-auto ">
                Your daily dose of doubt
              </h2>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-end gap-3 pb-3 pr-4">
        <ThemeToggle />
        <LoginRegButtons />
      </div>
    </div>
  );
}
