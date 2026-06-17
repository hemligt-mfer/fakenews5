"use client";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plan } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { deletePlan } from "@/_actions/subscription-actions";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format-price";

export const columns: ColumnDef<Plan>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.name;
            return <span className="text-xs block truncate max-w-20 md:max-w-full">{name}</span>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.original.description;
            return (
                <span className="text-xs block truncate max-w-20 md:max-w-full">{description}</span>
            );
        },
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.original.image;
            return <span className="text-xs block truncate max-w-20 md:max-w-full">{image}</span>;
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = row.original.price;
            return (
                <span className="text-xs block truncate max-w-20 md:max-w-full">
                    {formatPrice(price)}
                </span>
            );
        },
    },
    {
        accessorKey: "priceId",
        header: "Price ID",
        cell: ({ row }) => {
            const priceId = row.original.priceId;
            return <span className="text-xs block truncate max-w-20 md:max-w-full">{priceId}</span>;
        },
    },
    {
        accessorKey: "annualPrice",
        header: "Annual price",
        cell: ({ row }) => {
            const annualPrice = row.original.annualPrice;
            return (
                <span className="text-xs block truncate max-w-20 md:max-w-full">
                    {formatPrice(Number(annualPrice))}
                </span>
            );
        },
    },
    {
        accessorKey: "annualPriceId",
        header: "Annual price ID",
        cell: ({ row }) => {
            const annualPriceId = row.original.annualPriceId;
            return (
                <span className="text-xs block truncate max-w-20 md:max-w-full">
                    {annualPriceId}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <span className="flex justify-end">Actions</span>,
        cell: ({ row }) => <ActionsCell id={row.original.id} />,
    },
];

function ActionsCell({ id }: { id: string }) {
    const router = useRouter();

    async function del(id: string) {
        const res = await deletePlan(id);
        if (res.success && res.data) {
            toast.success(
                `The plan named "${res.data.name}" was successfully deleted from the database.`,
                { position: "top-center" },
            );
            router.refresh();
        } else if (!res.success && res.error) {
            toast.error(
                `An error occurred when trying to delete the plan with id ${id}.\n\n${res.error}`,
                { position: "top-center" },
            );
        }
    }

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
                        onClick={() => router.push(`/dashboard/admin/plans/${id}/edit`)}
                    >
                        Edit plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => del(id)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
