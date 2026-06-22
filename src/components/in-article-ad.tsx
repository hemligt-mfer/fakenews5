import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

export default async function InArticleAd() {
    const ad = await getActiveAd("in-article");

    if (!ad) {
        return (
            <div className="my-6 flex flex-col items-center gap-1">
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                    Advertisement
                </p>
                <div className="w-full max-w-[728px] h-[90px] bg-muted border border-dashed border-border flex items-center justify-center">
                    <span className="text-xs text-muted-foreground italic">No active in-article ad</span>
                </div>
            </div>
        );
    }

    return (
        <div className="my-6 flex flex-col items-center gap-1">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Advertisement
            </p>
            <a
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-[728px]"
            >
                <div className="relative w-full h-[90px]">
                    <Image
                        src={ad.imageUrl}
                        alt={ad.label}
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </div>
            </a>
        </div>
    );
}
