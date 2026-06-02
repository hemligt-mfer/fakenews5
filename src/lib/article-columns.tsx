"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export type Article = {
  id: string;
  summary: string | null;
  title: string;
  image: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  location: string | null;
};

function ActionsCell({ id }: { id: string }) {
  const router = useRouter();

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
            onClick={() => router.push(`/article/${id}`)}
          >
            View article
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/article/${id}/edit`)}
          >
            Edit article
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<Article>[] = [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const name = row.original.title;
      return (
        <span className="text-xs block truncate max-w-20 md:max-w-full">
          {name}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <span className="">
          {new Intl.DateTimeFormat("sv-SE").format(date)}
        </span>
      );
    },
  },
  {
    accessorKey: "views",
    header: "Views",
    cell: ({ row }) => {
      const views = row.original.views;
      return <span className="flex justify-center">{views}</span>;
    },
  },
  {
    id: "actions",
    header: () => <span className="flex justify-end">Actions</span>,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];
