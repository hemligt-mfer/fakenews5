import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

export default async function AdBanner() {
    const ad = await getActiveAd("banner");

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700 py-3 px-4 flex flex-col items-center gap-2">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Advertisement
            </p>
            {ad ? (
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-4xl"
                >
                    <div className="relative w-full max-w-4xl h-[100px]">
                        <Image
                            src={ad.imageUrl}
                            alt={ad.label}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </a>
            ) : (
                <div className="w-full max-w-4xl h-20 rounded bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                        Your ad could be here
                    </span>
                </div>
            )}
        </div>
    );
}
