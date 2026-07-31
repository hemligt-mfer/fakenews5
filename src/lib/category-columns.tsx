"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Category } from "./types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DeleteCategoryDialog } from "@/components/delete-category-btn";
import { useState } from "react";

function ActionsCell({ id }: { id: string }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/category/${id}/edit`)}
          >
            Edit category
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            Delete category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCategoryDialog
        categoryId={id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <span className="text-xs block truncate max-w-20 md:max-w-full">
          {id}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <span className="text-xs block truncate max-w-20 md:max-w-full">
          {name}
        </span>
      );
    },
  },
  {
    accessorKey: "parentId",
    header: () => <span className="flex justify-center">Parent ID</span>,
    cell: ({ row }) => {
      const parentId = row.original.parentId;
      return <span className="flex justify-center">{parentId}</span>;
    },
  },

  {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];
