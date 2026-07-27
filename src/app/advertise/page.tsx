import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Newspaper, Users, TrendingUp, Megaphone } from "lucide-react";

export const metadata: Metadata = { title: "Advertise | The Daily Commit" };

const adFormats = [
  {
    name: "Banner",
    placement: "Top of every page, under the masthead",
    size: "970 × 250 px",
    price: "12 000 kr / week",
  },
  {
    name: "Sidebar",
    placement: "Right-hand sidebar, all news pages",
    size: "300 × 600 px",
    price: "7 500 kr / week",
  },
  {
    name: "Newsletter",
    placement: "Sponsored slot in our daily newsletter",
    size: "600 × 200 px",
    price: "3 500 kr / send",
  },
  {
    name: "Sponsored article",
    placement: "Native article written with your team, clearly labelled",
    size: "—",
    price: "25 000 kr / article",
  },
];

const stats = [
  {
    icon: <Users size={18} />,
    value: "250 000+",
    label: "monthly readers",
  },
  {
    icon: <Newspaper size={18} />,
    value: "40 000+",
    label: "newsletter subscribers",
  },
  {
    icon: <TrendingUp size={18} />,
    value: "4.2 min",
    label: "average time on site",
  },
];

export default function AdvertisePage() {
  return (
    <div className="h-full flex flex-col mx-auto w-full max-w-5xl px-6 pt-14 pb-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-wide">
          Advertise with The Daily Commit
        </h1>
        <p className="mt-2 italic text-muted-foreground">
          Reach a loyal audience that reads everything — and believes most of
          it.
        </p>
      </div>

      <section className="mb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border p-5 bg-popover shadow-sm text-center"
            >
              <div className="mb-2 flex items-center justify-center gap-2 text-primary">
                {stat.icon}
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-bold text-2xl mb-3">
          Why The Daily Commit?
        </h2>
        <p className="leading-relaxed text-sm mb-3 max-w-3xl">
          The Daily Commit is one of Sweden&apos;s fastest-growing news
          destinations. Our readers come for local news from Linköping, national
          coverage, world events, economy, and sports — and they stay because
          nowhere else covers them quite like we do.
        </p>
        <p className="leading-relaxed text-sm max-w-3xl">
          Whether you want a banner across the masthead, a presence in our daily
          newsletter, or a sponsored article produced together with our
          editorial team, we have a format that fits your campaign and your
          budget.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-bold text-2xl mb-4">
          Formats &amp; Rates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">Format</th>
                <th className="text-left py-2 pr-4 font-semibold">Placement</th>
                <th className="text-left py-2 pr-4 font-semibold">Size</th>
                <th className="text-left py-2 font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {adFormats.map((format) => (
                <tr key={format.name} className="border-b">
                  <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">
                    {format.name}
                  </td>
                  <td className="py-3 pr-4 leading-relaxed">
                    {format.placement}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">{format.size}</td>
                  <td className="py-3 whitespace-nowrap">{format.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          All rates exclude VAT. Discounts available for 4+ week bookings and
          combination packages. Sponsored content is always clearly labelled in
          accordance with Swedish marketing law.
        </p>
      </section>

      <section className="rounded-xl border p-6 bg-popover shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <Megaphone size={15} />
          Get started
        </div>
        <p className="text-sm leading-relaxed mb-4 max-w-2xl">
          Tell us about your company, your goals, and your timeline — our ad
          team will get back to you within one business day with a proposal.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="flex items-center gap-2 text-sm">
            <Mail size={15} className="text-primary" />
            <strong>ads@thedailycommit.se</strong>
          </p>
          <span className="hidden sm:inline text-muted-foreground">·</span>
          <Link href="/contact" className="text-sm underline hover:opacity-70">
            or use our contact form
          </Link>
        </div>
      </section>
    </div>
  );
}
