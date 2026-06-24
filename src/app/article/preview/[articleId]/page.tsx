import { addView, getArticle } from "@/_actions/article-actions";
import Views from "../../[articleID]/_components/views";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import Link from "next/link";
import ArticleDoesntExist from "../../[articleID]/_components/article-doesnt-exists";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import { format } from "date-fns";
import { ContinueToReadCard } from "@/components/continue-read-card";

export default async function PreviewArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const article = await getArticle(articleId);

  if (article.success && article.data) {
    await addView(articleId);
    let totalReactions = 0;
    for (const r of article.data.reactions) {
      totalReactions += r.val;
    }

    return (
      <div className="p-2 w-full">
        {article.data.category.length > 0 &&
          article.data.category.map((c, i) => {
            if (i + 1 !== article.data.category.length)
              return (
                <Link key={i} href={`/category/${c.id}`}>
                  {c.name} ,
                </Link>
              );
            else
              return (
                <Link key={i} href={`/category/${c.id}`}>
                  {c.name}
                </Link>
              );
          })}
        <h1 className="font-extrabold text-3xl text-center">
          {article.data.title}
        </h1>
        <article className="mt-2 mb-4 max-w-none dark:bg-[#2d2d2d] dark:text-white prose dark:prose-headings:text-white border p-4">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkIns]}>
            {article.data.content.slice(0, 500) + " ..."}
          </ReactMarkdown>
          <ContinueToReadCard/>
        </article>{" "}
        <div className="flex border-b-2 mt-2 pb-2 text-sm">
          <div className="flex border-r pr-2">
            <Views num={article.data.views} />
          </div>
          <div className="flex border-r pr-2">
            <Likes num={totalReactions} />
          </div>
          <div className="flex border-r pl-2 pr-2">
            <Bookmark />
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
