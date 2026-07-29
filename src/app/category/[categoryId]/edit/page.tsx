import RouteHeading from "@/components/route-heading";
import EditCatForm from "./_components/edit-category";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";


export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ categoryId: string }>;
}){

    const {categoryId} = await params;
    console.log("CategoryID param:", categoryId);
    const category = await prisma.category.findUnique({
        where: { id : categoryId},
        select: { name: true}
    })
    if(!category){
        return notFound()
    }

    return (
        <div className="w-full">
            <RouteHeading label="Edit Category"/>
            <EditCatForm categoryId={categoryId} Category={category}/>
        </div>
    )
}