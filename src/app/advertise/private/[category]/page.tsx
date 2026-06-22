import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategoryBySlug } from "../_data/categories";
import AdForm from "./_components/ad-form";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return { title: "Not Found" };
  return { title: `${cat.name} — Classifieds | Fakenews5` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-10 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-8">
        <Link
          href="/advertise/private"
          className="hover:text-foreground transition-colors"
        >
          Classifieds
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{cat.name}</span>
      </nav>

      <div className="mb-8">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-primary mb-1">
          Place an ad
        </p>
        <h1 className="font-serif text-3xl font-bold">{cat.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the form below. Your ad will be reviewed and published within
          one business day.
        </p>
      </div>

      <AdForm
        categorySlug={cat.slug}
        subcategories={cat.subcategories}
        titlePlaceholder={cat.titlePlaceholder}
      />
    </div>
  );
}
