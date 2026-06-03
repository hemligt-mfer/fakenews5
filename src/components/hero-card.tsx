import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

type HeroCardProps = {
    id: string;
    title: string;
    summary: string | null;
    image: string | null;
    category: { name: string }[];
    author: { alias: string }[];
    createdAt: Date;
};

export default function HeroCard({
    id, title, summary, image, category, author, createdAt,
}: HeroCardProps) {
    const categories = category.map((c) => c.name);
    const authorNames = author.map((a) => a.alias).join(", ");

    return (
        <Link href={`/article/${id}`} className="group block">
            {/* Large image */}
            <div className="relative w-full aspect-video overflow-hidden bg-muted border border-border mb-4">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 70vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground opacity-40">No image</span>
                    </div>
                )}
            </div>

            {/* Category labels */}
            <div className="flex gap-2 mb-2">
                {categories.map((cat) => (
                    <span
                        key={cat}
                        className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#c8a84b]"
                    >
                        {cat}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl font-bold leading-tight text-foreground group-hover:text-[#c8a84b] transition-colors mb-3">
                {title}
            </h1>

            {/* Summary */}
            {summary && (
                <p className="font-sans text-base text-muted-foreground leading-relaxed mb-3">
                    {summary}
                </p>
            )}

            {/* Author · Date */}
            <p className="font-sans text-sm text-muted-foreground">
                {authorNames && <span>By {authorNames} · </span>}
                {format(createdAt, "d MMMM yyyy")}
            </p>
        </Link>
    );
}
