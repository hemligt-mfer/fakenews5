// export default function Footer() {
//   return (
//     <div className="bg-[#2d2d2d] text-white text-sm p-4 border-t-5 border-[#c8a84b] text-center">
//       <p>Copyright © 2026 The Daily Commit. All Rights Reserved.</p>
//     </div>
//   );
// }

import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Footer() {
  const session = await auth.api.getSession({ headers: await headers() });
  const registerHref = session ? "/" : "/register";
  const myPageHref = !session ? "/sign-in"
    : session.user.role === "admin" ? "/dashboard/admin"
    : "/dashboard";

  return (
    <footer className="bg-grey-100 dark:bg-[#2d2d2d] pt-9 pb-5 border-t-2 border-t-primary">
      <div className="max-w-305 mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-7">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-[40px] mb-2">
              The Daily Commit
            </p>
            <p className="font-serif text-[16px] font-bold mb-2">
              YOUR DAILY DOSE OF NEWS. <br /> COMMITTED TO THE TRUTH.
            </p>
            <p className="font-sans text-[11px] leading-relaxed"></p>
          </div>{" "}
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] mb-3">
              News
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              {["local", "sweden", "world", "economy", "sports"].map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c}`}
                    className="hover:text-primary transition-colors capitalize"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] mb-3">
              Account
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              <li>
                <Link href="/sign-in" className="hover:text-primary transition-colors">Sign in</Link>
              </li>
              <li>
                <Link href={registerHref} className="hover:text-primary transition-colors">Register</Link>
              </li>
              <li>
                <Link
                  href="/subscribe"
                  className="hover:text-primary transition-colors"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  href={myPageHref}
                  className="hover:text-primary transition-colors"
                >
                  My Page
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] mb-3">
              Company
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="hover:text-primary transition-colors"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/tos"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-[#333] mb-3.5" />
        <div className="flex flex-col gap-1.5 md:flex-row md:justify-between md:items-center font-sans text-[11px]">
          <span>Copyright © 2026 The Daily Commit. All Rights Reserved.</span>
          <span className="flex gap-3">
            <Link
              href="/legal/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <span>·</span>
            <Link href="/legal/tos" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <span>·</span>
            <Link
              href="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
