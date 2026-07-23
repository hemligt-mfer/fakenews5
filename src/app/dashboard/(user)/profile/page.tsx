import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NewsletterForm from "@/components/newsletter/newsletter-form";
import { getCategories } from "@/_actions/category-actions";
import { getAuthors } from "@/_actions/article-actions";
import { redirect } from "next/navigation";
import { defaultSettings } from "@/components/newsletter/_actions/newsletter-actions";
import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";

function daysSinceLastLogin(updatedAt: Date | string): number {
  const lastLogin = new Date(updatedAt);
  return differenceInCalendarDays(new Date(), lastLogin);
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in");
  }
  const daysSince = daysSinceLastLogin(session.session.updatedAt);
  let isSub = false;
  if (session.user.role !== "user") {
    isSub = true;
  }

  //newsletter components
  const cats = await getCategories();
  const auths = await getAuthors();
  const categories = [];
  const authors = [];

  if (cats.success && cats.data) {
    for (const c of cats.data) {
      categories.push(c.name);
    }
  }
  if (auths.success && auths.data) {
    for (const a of auths.data) {
      authors.push(a.alias);
    }
  }

  const defaultOptions = await defaultSettings(session.user.email);
  const defaultCats = [];
  const defaultAuthors = [];
  if (defaultOptions !== null) {
    for (const c of defaultOptions.categories) {
      defaultCats.push(c.name);
    }
    for (const a of defaultOptions.authors) {
      defaultAuthors.push(a.alias);
    }
  }
  const defEmail = defaultOptions?.email || "";
  const activeSub = defaultOptions?.active || false;

  return (
    <div suppressContentEditableWarning suppressHydrationWarning>
      <RouteHeading label="Dashboard" />
      <div className="m-5">
        <h1 className="text-3xl font-medium mb-4">
          Welcome back {session.user.name}!
        </h1>
        {/* <p>
          {daysSince === 0
            ? "You were last active today"
            : `It's been ${daysSince} day${daysSince === 1 ? "" : "s"} since your last visit`}
        </p> */}
        {isSub === true ? (
          <div className="pt-10">
            <h1 className="text-2xl  mb-4">
              Personalized newsletters are sent out every Sunday!
            </h1>
            <NewsletterForm
              categories={categories}
              authors={authors}
              isSubbed={activeSub}
              dCats={defaultCats}
              dAuthor={defaultAuthors}
              email={defEmail}
            />
          </div>
        ) : (
          <div className="pt-10">
            <h1 className="text-2xl mb-4">
              Subscribe to unlock personalized newsletters!
            </h1>
            <Link href={"/subscriptions"} className="underline text-sm">
              View subscriptions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
