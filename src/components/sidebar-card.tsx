import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type SidebarCardProps = {
    id: string;
    title: string;
    image: string | null;
    category: { name: string }[];
    author: { alias: string }[];
    createdAt: Date;
};

export default function SidebarCard({ id, title, image, category, author, createdAt }: SidebarCardProps) {
    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
    return (
        <Link href={`/article/${id}`} className="group block border-b border-border pb-5 last:border-0">
            <div className="relative w-full aspect-video overflow-hidden bg-muted border border-border mb-2">
                {image ? (
                    <Image src={image} alt={title} fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="300px" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground opacity-40">No image</span>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mb-1">
                {category.map((c) => (
                    <span key={c.name} className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[#c8a84b]">
                        {c.name}
                    </span>
                ))}
            </div>
            <h3 className="font-serif text-[15px] font-bold leading-snug text-foreground group-hover:text-[#c8a84b] transition-colors mb-1">
                {title}
            </h3>
            <p className="font-sans text-[11px] text-muted-foreground">
                {author[0]?.alias && <span>{author[0].alias} · </span>}
                {timeAgo}
            </p>
        </Link>
    );
}
