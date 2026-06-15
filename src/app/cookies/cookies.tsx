import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-10 py-14 text-black dark:text-white">
      <h1 className="font-serif font-bold text-4xl mb-8">Cookie Policy</h1>

      <p className="mb-6 text-muted-foreground text-sm">Last updated: June 2026</p>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">What are cookies?</h2>
        <p className="leading-relaxed text-sm">
          Cookies are small text files placed on your device when you visit a website. They are
          widely used to make websites work, improve performance, and provide information to the
          site owner.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">How we use cookies</h2>
        <p className="leading-relaxed text-sm mb-4">
          Fakenews5 uses <strong>essential cookies only</strong>. These are strictly necessary for
          the site to function and cannot be switched off. They are set in response to actions made
          by you, such as signing in or adjusting preferences.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-semibold">Cookie</th>
                <th className="text-left py-2 pr-4 font-semibold">Type</th>
                <th className="text-left py-2 pr-4 font-semibold">Duration</th>
                <th className="text-left py-2 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                {
                  name: "cart",
                  type: "Essential",
                  duration: "7 days",
                  purpose: "Stores your shopping cart items so they persist across page loads and sessions.",
                },
                {
                  name: "cookie_consent",
                  type: "Essential",
                  duration: "1 year",
                  purpose: "Remembers your cookie preference so we do not ask again on every visit.",
                },
                {
                  name: "better-auth.*",
                  type: "Essential",
                  duration: "Session",
                  purpose: "Session and authentication tokens required to keep you signed in.",
                },
              ].map((row) => (
                <tr key={row.name} className="border-b">
                  <td className="py-2 pr-4 font-mono text-xs text-foreground">{row.name}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-2 pr-4 whitespace-nowrap">{row.duration}</td>
                  <td className="py-2 leading-relaxed">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">What we do NOT use</h2>
        <p className="leading-relaxed text-sm">
          We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
          No data about your browsing behaviour is shared with any third party.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-serif font-bold text-xl mb-3">Managing cookies</h2>
        <p className="leading-relaxed text-sm">
          You can control and delete cookies through your browser settings. Note that disabling
          essential cookies may affect how the site functions — for example, you may not be able
          to stay signed in.
        </p>
        <p className="leading-relaxed text-sm mt-3">
          <strong>Essential cookies</strong> are set under the legitimate-interest basis of GDPR
          Article 6(1)(b) (necessary for the performance of a contract) and cannot be disabled
          without breaking core site functionality.
        </p>
      </section>

      <section>
        <h2 className="font-serif font-bold text-xl mb-3">Contact</h2>
        <p className="leading-relaxed text-sm">
          If you have any questions about our use of cookies, please{" "}
          <Link href="/contact" className="underline hover:opacity-70">
            contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
