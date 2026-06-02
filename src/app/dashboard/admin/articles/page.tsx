import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import { columns } from "@/lib/article-columns";

const articles = await prisma.article.findMany({})

export default function ArticleTablePage(){

    return (<div className="w-full">
        <RouteHeading label="Articles"/>
        <DataTable columns={columns} data={articles}/>
    </div>)
}