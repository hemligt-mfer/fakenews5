import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us | The Daily Commit" };

export default function ContactPage() {
  return (
    <div className="h-full flex flex-col mx-auto w-full max-w-5xl px-6 pt-14">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-wide">
          Get in Touch
        </h1>
        <p className="mt-2 italic text-black/60 dark:text-muted-foreground">
          Questions, tips, or spotted a typo? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mb-10 grid gap-10 md:grid-cols-[1fr_280px]">
        <ContactForm />

        <aside className="space-y-4">
          {[
            {
              icon: <Mail size={15} />,
              title: "Email",
              lines: ["tips@thedailycommit.se", "support@thedailycommit.se"],
            },
            {
              icon: <MapPin size={15} />,
              title: "Address",
              lines: ["Nyhetsgatan 5", "58227 Linköping, Sweden"],
            },
            {
              icon: <Clock size={15} />,
              title: "Support Hours",
              lines: ["Mon–Fri  09:00–17:00", "Sat–Sun  Closed"],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border p-4 mt-7 bg-popover shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                {item.icon}
                {item.title}
              </div>
              {item.lines.map((line) => (
                <p key={line} className="text-sm text-black/60 dark:text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
