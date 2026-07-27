import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommentAvatar({
    imageUrl,
    fallbackTxt,
    size = "lg",
}: {
    imageUrl: string | undefined;
    fallbackTxt: string;
    size: "sm" | "lg";
}) {
    if (size === "lg") {
        return (
            <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
                <Avatar className="h-13 w-13">
                    <AvatarImage src={imageUrl} alt={"avatar " + fallbackTxt} />
                    <AvatarFallback>{fallbackTxt}</AvatarFallback>
                </Avatar>
            </div>
        );
    } else {
        return (
            <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
                <Avatar className="h-7 w-7">
                    <AvatarImage src={imageUrl} alt={"avatar " + fallbackTxt} />
                    <AvatarFallback>{fallbackTxt}</AvatarFallback>
                </Avatar>
            </div>
        );
    }
}
