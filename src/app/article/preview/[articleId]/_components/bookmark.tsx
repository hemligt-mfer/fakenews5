"use client";

import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";

export default function Bookmark() {
    function error() {
        toast.error("You need to be a paying subscriber in order to bookmark articles.", {
            position: "top-center",
        });
    }

    return (
        <div className="cursor-pointer">
            <BookmarkIcon onClick={error} />
        </div>
    );
}
