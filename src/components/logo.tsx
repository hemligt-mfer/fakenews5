import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <span className=" lg:flex lg:items-center p-2 justify-start  ">
      <Link href="/">
        <div className="flex md:gap-1 ">
          <div className="sm:hidden relative shrink-0.5">
            <Image
              src="/lightlogo.png"
              width={100}
              height={100}
              alt="Logo"
              className="dark:hidden"
              priority
            />
            <Image
              src="/darklogo.png"
              width={100}
              height={100}
              alt="Logo"
              className="hidden dark:block"
              priority
            />
          </div>

          <div className=" my-auto w-full max-w-160 pt-2 max-sm:hidden">
            <div className="flex items-center max-sm:h-1 gap-3 -mb-3">
              <div className="flex-1 h-px bg-black dark:bg-white"></div>
              <span className="font-serif font-bold text-[10px] sm:text-lg tracking-tighter md:tracking-widest max-[540px]:text-[6px]">
                THE
              </span>
              <div className="flex-1 h-px bg-black dark:bg-white"></div>
            </div>
            <span className="inline-flex items-center whitespace-nowrap font-serif font-bold text-sm sm:text-5xl leading-tight tracking-tight -mb-1">
              <span>Daily C</span>
              <span className="relative inline-block w-[1.2em] h-[1.2em] mx-[-0.15em] align-middle rotate-70">
                <Image
                  src="/lightlogo.png"
                  alt=""
                  fill
                  sizes="48px"
                  className="dark:hidden object-contain"
                  priority
                />
                <Image
                  src="/darklogo.png"
                  alt=""
                  fill
                  sizes="48px"
                  className="hidden dark:inline-block object-contain"
                  priority
                />
              </span>
              <span>mmit</span>
            </span>
            <div className="border-b-4 border-primary md:mt-1"></div>
            <p className="text-center text-[7px] sm:text-xs tracking-tighter md:tracking-wide max-[540px]:mt-0 mt-0.5 md:mt-2 ">
              YOUR DAILY DOSE OF NEWS.{" "}
              <span className="text-primary font-bold">COMMITTED</span> TO THE
              TRUTH.
            </p>
          </div>
        </div>
      </Link>
    </span>
  );
}
