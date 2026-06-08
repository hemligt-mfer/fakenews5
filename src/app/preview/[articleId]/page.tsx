import { getArticle } from "@/_actions/article-actions";

export default async function PreviewPage({ params }: { params: Promise<{ articleID: string }> }) {
    const { articleID } = await params;
    const article = getArticle(articleID);

    return (
        <div>
            <h1></h1>
        </div>
    );
}
