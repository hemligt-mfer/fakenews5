import { columns } from "@/lib/userColumns";
import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";

const user = await prisma.user.findMany({})

export default function UserPage(){

    return (<div className="w-full">
        <RouteHeading label="Users"/>
        <DataTable columns={columns} data={user}/>
    </div>)
}