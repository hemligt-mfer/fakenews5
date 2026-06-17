"use server";
import { columns } from "@/lib/userColumns";
import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// TODO: Make it so that Author alias field doesn't show if the user is a normal user/subscriber and you should not be able to denote yourself as admin
export default async function UserTablePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect("/");
    }
    if (session.user.role !== "admin") {
        redirect("/");
    }
    const user = await prisma.user.findMany({});
    return (
        <div className="w-full">
            <RouteHeading label="Users" />
            <DataTable columns={columns} data={user} />
        </div>
    );
}
