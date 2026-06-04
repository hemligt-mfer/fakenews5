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

export default function HeroCard({ id, title, summary, image, category, author, createdAt }: HeroCardProps) {
    return (
        <Link href={`/article/${id}`} className="group block">
            <div className="relative w-full aspect-video overflow-hidden bg-muted border border-border mb-4">
                {image ? (
                    <Image src={image} alt={title} fill priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 70vw" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground opacity-40">No image</span>
                    </div>
                )}
            </div>
            <div className="flex gap-2 mb-2">
                {category.map((c) => (
                    <span key={c.name} className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#c8a84b]">
                        {c.name}
                    </span>
                ))}
            </div>
            <h1 className="font-serif text-3xl font-bold leading-tight text-foreground group-hover:text-[#c8a84b] transition-colors mb-3">
                {title}
            </h1>
            {summary && (
                <p className="font-sans text-base text-muted-foreground leading-relaxed mb-3">{summary}</p>
            )}
            <p className="font-sans text-sm text-muted-foreground">
                {author.length > 0 && <span>By {author.map((a) => a.alias).join(", ")} · </span>}
                {format(createdAt, "d MMMM yyyy")}
            </p>
        </Link>
    );
}
