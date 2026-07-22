import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommentAvatar({
    imageUrl,
    fallbackTxt,
}: {
    imageUrl: string | undefined;
    fallbackTxt: string;
}) {
    return (
        <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
            <Avatar className="h-13 w-13">
                <AvatarImage src={imageUrl} alt={"avatar " + fallbackTxt}/>
                <AvatarFallback>{fallbackTxt}</AvatarFallback>
            </Avatar>
        </div>
    );
}
