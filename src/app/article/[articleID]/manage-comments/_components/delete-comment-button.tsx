import { deleteComment } from "@/_actions/comment-actions";
import Button from "@/components/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteCommentButton({ commentId }: { commentId: string }) {
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();

    async function handleClick() {
        setLoading(true);
        const res = await deleteComment(commentId);
        if (res.success) {
            toast("The comment has successfully been deleted", { position: "top-center" });
        } else {
            toast(res.error);
        }
        setLoading(false);
        router.refresh();
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button size="xs" variant="destructive" className="ml-2">
                    <Trash2 size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Instead of the comment a text explaining that
                        it has been removed will be shown.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-center">
                    <div className="flex gap-2 items-center">
                        <DialogClose asChild>
                            <Button variant={"outline"} disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose onClick={handleClick}>
                            {loading ? <Spinner /> : "Yes"}
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
