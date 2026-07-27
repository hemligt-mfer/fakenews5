import { getArticle } from "@/_actions/article-actions";
import Views from "../../[articleID]/_components/views";
import Likes from "./_components/likes";
import Link from "next/link";
import ArticleDoesntExist from "../../[articleID]/_components/article-doesnt-exists";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import Image from "next/image";
import { format } from "date-fns";
import { ContinueToReadCard } from "@/components/continue-read-card";
import RouteHeading from "@/components/route-heading";

export default async function PreviewArticlePage({
    params,
}: {
    params: Promise<{ articleId: string }>;
}) {
    const { articleId } = await params;
    const article = await getArticle(articleId);

    if (article.success && article.data) {
        // await addView(articleId);
        let totalReactions = 0;
        for (const r of article.data.reactions) {
            totalReactions += r.val;
        }

        return (
            <div className="flex-row justify-center w-full px-4 py-2">
                {article.data.category.length > 0 &&
                    article.data.category.map((c, i) => {
                        if (i + 1 !== article.data.category.length)
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    <RouteHeading label={c.name}></RouteHeading>
                                </Link>
                            );
                        else
                            return (
                                <Link key={i} href={`/category/${c.id}`}>
                                    <RouteHeading label={c.name}></RouteHeading>
                                </Link>
                            );
                    })}
                {article.data.image && (
                    <div className="relative ">
                        <Image
                            src={article.data.image}
                            alt={article.data.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                )}
                {article.data.image && (
                    <div className="relative w-full h-[40vh] md:h-auto md:w-3/4 md:aspect-video mx-auto mt-2 overflow-hidden border border-border">
                        <Image
                            src={article.data.image}
                            alt={article.data.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                )}
                <h1 className="font-extrabold text-3xl text-center w-3/4 mx-auto my-2">
                    {article.data.title}
                </h1>
                <div className="md:w-3/4 flex-row mx-auto max-w-none bg-gray-100 dark:bg-[#2d2d2d] text-black dark:text-white  p-4">
                    <p>{article.data.summary}</p>
                </div>

                <article className="md:w-3/4 flex-row mx-auto mt-2 mb-4 max-w-none prose dark:prose-invert dark:bg-[#2d2d2d] dark:text-white dark:prose-headings:text-white p-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkIns]}>
                        {article.data.content.slice(0, 500)}
                    </ReactMarkdown>
                </article>
                <ContinueToReadCard />
                {/* <InArticleAd /> */}
                <div className="flex border-b-2 mt-2 pb-2 text-sm bg-gray-100 dark:bg-[#2d2d2d] p-4">
                    <div className="flex border-r pr-2">
                        <Views num={article.data.views} />
                    </div>

                    <div className="flex border-r pr-2">
                        <Likes num={totalReactions} />
                    </div>

                    <div className="flex ml-auto">
                        <p className="text-md font-semibold text-center mr-4">
                            by{" "}
                            {article.data.author.map((a, i) =>
                                i + 1 !== article.data.author.length
                                    ? `${a.alias}, `
                                    : `${a.alias}`,
                            )}
                        </p>
                        {article.data.location ? article.data.location + ", " : ""}
                        {format(article.data.createdAt, "yyyy-MM-dd HH:mm")}
                    </div>
                </div>
            </div>
        );
    } else {
        return <ArticleDoesntExist />;
    }
}
