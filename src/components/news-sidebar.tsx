import Link from "next/link";
import MarketsWidget from "./markets-widget";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WeatherApp from "./weather-app";
import SidebarAd from "./sidebar-ad";

type SidebarArticle = {
  id: string;
  title: string;
};

type Props = {
  mostRead: SidebarArticle[];
};

export default function NewsSidebar({ mostRead }: Props) {
  return (
    <aside className="border-l border-border pl-6">
      {/* Weather */}
      <div className="mb-7">
        <WeatherApp />
      </div>

      {/* Markets */}
      <div className="mb-7">
        <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b-2 border-foreground pb-1.5 mb-3">
          Markets{" "}
          <span className="font-normal text-muted-foreground">[API]</span>
        </h3>
        <MarketsWidget />
      </div>

      {/* Most Read Today */}
      {mostRead.length > 0 && (
        <div className="mb-7">
          <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b-2 border-foreground pb-1.5 mb-3">
            Most Read Today
          </h3>
          <ul className="divide-y divide-border">
            {mostRead.map((a, i) => (
              <li
                key={a.id}
                className="py-2 font-sans text-[13px] text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Link href={`/article/${a.id}`}>
                  <span className="font-bold text-primary mr-2">{i + 1}</span>
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sidebar ad */}
      {/* <div className="mb-7">
        <SidebarAd />
      </div> */}

      {/* Morning Briefing / Newsletter */}
      {/* suppressHydrationWarning: password managers (e.g. ProtonPass) inject attributes onto forms */}
      <div
        className="bg-muted border border-border p-3.5"
        suppressHydrationWarning
      >
        <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest border-b-2 border-foreground pb-1.5 mb-3">
          Recieve weekly newsletters
        </h3>
        <p className="font-sans text-[12px] text-muted-foreground mb-2.5">
          Top stories delivered to your inbox every Sunday.
        </p>
        <Button className="w-full mt-2 rounded-none bg-foreground text-background hover:bg-primary font-sans text-[12px] font-bold uppercase tracking-[0.06em]">
          <Link href="/dashboard/profile">Sign Up Free</Link>
        </Button>
      </div>
    </aside>
  );
}
