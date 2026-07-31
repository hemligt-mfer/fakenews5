import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { deleteCategory } from "@/_actions/category-actions";
import { redirect } from "next/navigation";
import { AlertDialog ,AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type Props = {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function DeleteCategoryDialog({
  categoryId,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [loading, setIsloading] = useState(false);

  async function handleDelete() {
    setIsloading(true);
    try {
      await deleteCategory(categoryId);
      onSuccess?.();
      toast.success("Deleted category", { position: "bottom-right" });
      onOpenChange(false);
      redirect("/dashboard/admin/categories");
    } finally {
      setIsloading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this category. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? <Spinner /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type PropsButton = React.ComponentProps<typeof Button> & {
  categoryId: string;
  onSuccess?: () => void;
};

export function DeleteCategoryBtn({
  categoryId,
  onSuccess,
  ...props
}: PropsButton) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="cursor-pointer" variant="destructive" size="lg" onClick={() => setOpen(true)} {...props}>
        Delete
      </Button>
      <DeleteCategoryDialog
        categoryId={categoryId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
