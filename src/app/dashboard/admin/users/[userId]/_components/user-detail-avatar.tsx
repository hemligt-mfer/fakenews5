

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetailAvatar({
    imageUrl,
    fallbackTxt,
}: {
    imageUrl: string | undefined;
    fallbackTxt: string;
}) {
    return (
        <div className="flex flex-row flex-wrap gap-6 md:gap-12">
            <Avatar className="h-30 w-30">
                <AvatarImage src={imageUrl} alt={"avatar " + fallbackTxt}/>
                <AvatarFallback>{fallbackTxt}</AvatarFallback>
            </Avatar>
        </div>
    );
}