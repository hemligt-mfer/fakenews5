import { addView, getArticle } from "@/_actions/article-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Views from "../../[articleID]/_components/views";
import Likes from "./_components/likes";
import Bookmark from "./_components/bookmark";
import Link from "next/link";
import ArticleDoesntExist from "../../[articleID]/_components/article-doesnt-exists";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkIns from "remark-ins";
import { Button } from "@/components/ui/button";

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
        <h1 className="font-extrabold text-2xl text-center">
          {article.data.title}
        </h1>
        <p className="text-lg font-semibold text-center">
          by{" "}
          {article.data.author.map((a, i) =>
            i + 1 !== article.data.author.length
              ? `${a.alias}, `
              : `${a.alias}`,
          )}
        </p>
        <article className="mt-2 mb-4 max-w-none dark:bg-white prose border p-4">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkIns]}>
            {article.data.content.slice(0, 500) + " ..."}
          </ReactMarkdown>
          <Card className="w-xl mx-auto mt-4 bg-zinc-300 text-black">
            <CardHeader className="bg-zinc-200">
              <CardTitle className="text-center font-bold text-2xl">Continue to read!</CardTitle>
              <div className="flex gap-12">
                 <div className="flex items-center gap-2"><p>Already have an account?</p>
                <Link href="/sign-in">Sign in</Link>
              </div>
              <div className="flex items-center gap-2"><p>Activate your subsciption here</p> 
              <Link href="/subscriptions">Subscriptions</Link></div>
              </div>
             
             
            </CardHeader>
             <CardContent>
                In order to access the full article, read and write comments you
                need to sign up and subscribe to our basic plan.
              </CardContent>
          </Card>
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
        </div>
      </div>
    );
  } else {
    return <ArticleDoesntExist />;
  }
}
