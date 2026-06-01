import { Young_Serif } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { LoginRegButtons } from "./navbar/_components/login-register-buttons";

const fontUltra = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Header() {
  return (
    <div className="flex justify-between bg-[#2d2d2d] border-b-5 border-b-[#c8a84b]">
        <div className="flex md:hidden"><Image src={"/logo.svg"} width={90} height={90} alt="Logo" /></div>
      <div className="hidden md:flex w-full text-center p-5  mx-auto justify-center">
        <Link href="/">
          <div className="flex">
            <Image src={"/logo.svg"} width={90} height={90} alt="Logo" />
            <div className="flex flex-col justify-center">
              <h1 className="font-serif text-4xl font-bold  text-white text-shadow-xs text-shadow-black md:text-5xl">
                Fakenews5
              </h1>
              <h2 className="text-[#c8a84b] text-sm uppercase mr-auto text-shadow-black text-shadow-xs">
                Your daily dose of doubt
              </h2>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex justify-end mt-auto">
        <LoginRegButtons />
      </div>
    </div>
  );
}
