import prisma from "@/lib/prisma";
import { DataTable } from "@/components/Data-table";
import RouteHeading from "@/components/route-heading";
import { columns } from "@/lib/article-columns";

export default async function ArticleTablePage() {
    const articles = await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            summary: true,
            image: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            views: true,
            location: true,
            editorsChoice: true,
            deleted: true,
        },
    });

    return (
        <div className="w-full">
            <RouteHeading label="Articles" />
            <DataTable columns={columns} data={articles} />
        </div>
    );
}
