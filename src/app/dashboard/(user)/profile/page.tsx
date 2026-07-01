import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NewsletterForm from "@/components/newsletter/newsletter-form";
import { getCategories } from "@/_actions/category-actions";
import { getAuthors } from "@/_actions/article-actions";
import { redirect } from "next/navigation";
import {
  defaultSettings,
  getNewsLettersettingsFromId,
  isEmailSubscribed,
} from "@/components/newsletter/_actions/newsletter-actions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/sign-in");
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
      <div className="">
        <div className="pt-4">
          <h1 className="text-2xl font-medium mb-4">
            Recieve newsletters every Sunday!
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
      </div>
    </div>
  );
}
