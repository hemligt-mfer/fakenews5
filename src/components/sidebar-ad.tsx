import { getActiveAd } from "@/lib/ad-queries";
import Image from "next/image";

export default async function SidebarAd() {
    const ad = await getActiveAd("sidebar");

    return (
        <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500">
                Advertisement
            </p>
            {ad ? (
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <div className="relative w-[300px] h-[600px]">
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
                <div className="w-[300px] h-[300px] rounded bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic text-center px-4">
                        Your sidebar ad could be here
                    </span>
                </div>
            )}
        </div>
    );
}
