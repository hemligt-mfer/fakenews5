import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import {columns} from "@/lib/category-columns"
import prisma from "@/lib/prisma";


export default async function CategoryTablePage(){

    const categories = await prisma.category.findMany({
        select: {
            id: true, name: true, parentId: true,
        }
    })

    return (
       <div className="w-full">
                   <RouteHeading label="Categories" />
                   <DataTable columns={columns} data={categories} />
               </div>
    )
}