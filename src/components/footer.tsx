// export default function Footer() {
//   return (
//     <div className="bg-[#2d2d2d] text-white text-sm p-4 border-t-5 border-[#c8a84b] text-center">
//       <p>Copyright © 2026 Fakenews5. All Rights Reserved.</p>
//     </div>
//   );
// }

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-[#aaa] mt-10 pt-9 pb-5">
      <div className="max-w-305 mx-auto px-5">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-7">
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-[40px] font-bold text-white mb-2">
              Fakenews5
            </p>
            <p className="font-serif text-[16px] font-bold text-white mb-2">
              The World&apos;s <br />
              Most Unreliable <br></br>News Source
            </p>
            <p className="font-sans text-[11px] leading-relaxed"></p>
          </div>{" "}
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-white mb-3">
              News
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              {["local", "sweden", "world", "economy", "sports"].map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c}`}
                    className="hover:text-white transition-colors capitalize"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-white mb-3">
              Account
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/subscribe"
                  className="hover:text-white transition-colors"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  href="/my-page"
                  className="hover:text-white transition-colors"
                >
                  My Page
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-white mb-3">
              Company
            </p>
            <ul className="space-y-1.5 font-sans text-[12px]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Advertise
                </a>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-[#333] mb-3.5" />
        <div className="flex flex-col gap-1.5 md:flex-row md:justify-between md:items-center font-sans text-[11px]">
          <span>Copyright © 2026 Fakenews5. All Rights Reserved.</span>
          <span className="flex gap-3">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
