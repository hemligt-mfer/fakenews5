import { getArticle } from "@/_actions/article-actions";
import RouteHeading from "@/components/route-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Views from "../../[articleID]/_components/views";
import Likes from "./_components/likes";
import { toast } from "sonner";
import Bookmark from "./_components/bookmark";

export default async function PreviewArticlePage({
    params,
}: {
    params: Promise<{ articleId: string }>;
}) {
    const { articleId } = await params;
    const article = await getArticle(articleId);

    if (article.success && article.data) {
        let heading = "";
        if (article.data.category.length > 0) {
            article.data.category.map((c, i) => {
                if (i + 1 !== article.data.category.length) {
                    heading += `${c.name}, `;
                } else {
                    heading += `${c.name}`;
                }
            });
        }

        let totalReactions = 0;
        for (const r of article.data.reactions) {
            totalReactions += r.val;
        }

        return (
            <div className="p-2">
                <div className="w-5xl">
                    {heading.length > 0 && <RouteHeading label={heading} />}
                    <h1 className="font-extrabold text-2xl text-center">{article.data.title}</h1>
                    <p className="text-lg font-semibold text-center">
                        by{" "}
                        {article.data.author.map((a, i) =>
                            i + 1 !== article.data.author.length ? `${a.alias}, ` : `${a.alias}`,
                        )}
                    </p>
                    <p className="mt-2 mb-4">{article.data.content.slice(0, 500) + " ..."}</p>
                    <div className="flex border-b-2 mt-2 pb-2 text-sm">
                        <div className="flex border-r pr-2">
                            <Views num={article.data.views.length} />
                        </div>
                        <div className="flex border-r pr-2">
                            <Likes num={totalReactions} />
                        </div>
                        <div className="flex border-r pl-2 pr-2">
                            <Bookmark />
                        </div>
                    </div>
                    <Card className="w-xl mx-auto mt-4">
                        <CardHeader>
                            <CardTitle>Read the rest of the article</CardTitle>
                            <CardContent>
                                In order to access the full article, read and write comments you
                                need to sign up and subscribe to our basic plan.
                            </CardContent>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div>
            <p>Bajsbajsbajs</p>{" "}
        </div>
    );
}
