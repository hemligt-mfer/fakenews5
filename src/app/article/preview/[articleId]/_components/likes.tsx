"use client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export default function Likes({ num }: { num: number }) {
    async function error() {
        toast.error("You need to be a registered user in order to react to articles.", {
            position: "top-center",
        });
    }

    return (
        <div className="flex pl-2">
            <ThumbsUp size={20} onClick={error} className="cursor-pointer" />
            <ThumbsDown size={20} onClick={error} className="cursor-pointer" />
            <span className="my-auto ml-1">{num}</span>
        </div>
    );
}
