import Link from "next/link";
import Image from "next/image";
import { MapPin, UserRound, Clock, RefreshCw } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

type NewsCardProps = {
    id: string;
    title: string;
    summary: string | null;
    location: string | null;
    author: { alias: string }[];
    category: { name: string }[];
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    size?: "hero" | "medium" | "small" | "text";
};

export default function NewsCard({ id, title, summary, location, author, category, image, createdAt, updatedAt, size = "medium" }: NewsCardProps) {
    const wasUpdated = updatedAt.getTime() - createdAt.getTime() > 60_000;
    const categoryLabel = category[0]?.name ?? null;
    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
    const titleSize = size === "hero" ? "text-2xl leading-tight" : size === "small" ? "text-sm leading-snug" : size === "text" ? "text-lg leading-snug" : "text-base leading-snug";
    const aspectRatio = size === "small" ? "aspect-[3/2]" : "aspect-video";

    return (
        <Link href={`/article/${id}`} className="group block">
            {size !== "text" && (
                <div className={`relative w-full ${aspectRatio} mb-3 overflow-hidden bg-muted border border-border`}>
                    {image ? (
                        <Image src={image} alt={title} fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-muted-foreground opacity-50">No image</span>
                        </div>
                    )}
                </div>
            )}
            {categoryLabel && (
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#c8a84b] mb-1">
                    {categoryLabel}
                </p>
            )}
            <h3 className={`font-serif font-bold ${titleSize} text-foreground group-hover:text-[#c8a84b] transition-colors mb-1`}>
                {title}
            </h3>
            {size !== "small" && size !== "text" && summary && (
                <p className="font-sans text-sm text-muted-foreground line-clamp-3 mt-1">{summary}</p>
            )}
            {size === "text" ? (
                <p className="font-sans text-[11px] text-muted-foreground mt-1">{timeAgo}</p>
            ) : (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={11} />{format(createdAt, "d MMM yyyy, HH:mm")}</span>
                    {wasUpdated && (
                        <span className="flex items-center gap-1 text-[#c8a84b]">
                            <RefreshCw size={11} />Updated {format(updatedAt, "d MMM yyyy, HH:mm")}
                        </span>
                    )}
                    {location && <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>}
                    {author.length > 0 && <span className="flex items-center gap-1"><UserRound size={11} />{author.map((a) => a.alias).join(", ")}</span>}
                </div>
            )}
        </Link>
    );
}
