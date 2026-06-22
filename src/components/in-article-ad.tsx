import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

export default async function InArticleAd() {
    const ad = await getActiveAd("in-article");
    if (!ad) return null;

    return (
        <div className="my-6 flex flex-col items-center gap-1">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Advertisement
            </p>
            <a
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="relative w-full max-w-[728px] h-[90px]">
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
