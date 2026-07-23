"use client";

import Link from "next/link";
import type { ArticleWithScore } from "@/_actions/article-actions";

type Props = {
    data: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image: string | null;
        role: string | null;
        banReason: string | null;
        banned: boolean | null;
        banExpires: Date | null;
    }[];
};

type Propsu = {
    user: { name: string | null } | null;
    commentCount: number;
};

type Likes = {
    likes: {
        articleId: string;
        title: string | undefined;
        likes: number;
    }[];
};

type TopViewedProps = {
    articles: { articleId: string; title: string | undefined; views: number }[];
};
export function LatestRegUsers(data: Props) {
    return (
        <div className="border w-50 bg-card py-2 px-1 rounded-2xl shadow">
            <h1 className="font-heading text-base font-medium">Latest registered users</h1>
            {data.data.map((u) => (
                <div
                    key={u.id}
                    className="text-black border rounded-2xl bg-chart-2 py-2 my-1 text-center"
                >
                    <Link className="text-sm" href={`/dashboard/admin/users/${u.id}`}>
                        {u.name}
                    </Link>
                    <p className="text-xs">
                        {new Intl.DateTimeFormat("sv-SE").format(u.createdAt)}
                    </p>
                </div>
            ))}
        </div>
    );
}

export function Counts({
    articleCount,
    userCount,
    comments,
}: {
    articleCount: number;
    userCount: number;
    comments: number;
}) {
    return (
        <div className="flex flex-col border w-30 bg-card py-2 px-1 rounded-2xl shadow justify-between">
            <h1 className="font-heading text-base font-medium">Counts</h1>
            <div className="flex justify-between items-center border rounded-2xl bg-chart-2 p-1 text-black">
                <Link className="text-sm" href={"/dashboard/admin/articles"}>
                    Articles
                </Link>
                <span className="bg-chart-5 rounded-full p-1 ml-2">{articleCount}</span>
            </div>

            <div className="flex justify-between items-center border rounded-2xl bg-chart-2 p-1 text-black">
                <Link className="text-sm" href={"/dashboard/admin/users"}>
                    Users
                </Link>
                <span className="bg-chart-5 rounded-full p-1 ml-2">{userCount}</span>
            </div>

           <div className="flex justify-between items-center border rounded-2xl bg-chart-2 p-1 text-black">
                <p className="text-sm">Comments</p>
                <span className="bg-chart-5 rounded-full p-1 ml-2">{comments}</span>
            </div>
        </div>
    );
}

export function TopCommenter({ user, commentCount }: Propsu) {
    return (
        <div className="border rounded-2xl bg-card px-4 max-h-40">
            <h1 className="font-heading text-base font-medium">Top commenter</h1>
            <div className="flex justify-between items-center border rounded-full bg-chart-3 px-4 py-1 m-4">
                <p className="text-sm text-muted-foreground">{!user ? "" : user.name}</p>
                <span className="bg-chart-1 rounded-full p-1 ml-2">{commentCount}</span>
            </div>
        </div>
    );
}

type OnlyOnlyArticle = {
    id: string;
    title: string | null;
    views: number;
};
export function TopViewedArticles({ articles }: { articles: OnlyOnlyArticle[] }) {
    return (
        <div className="border rounded-2xl bg-card px-2 shadow mt-5">
            <h1 className="font-heading text-base font-medium">Most viewed article</h1>
            {articles.map((a) => (
                <div
                    key={a.id}
                    className="text-black border rounded-2xl bg-chart-5 py-2 px-2 my-2 text-center"
                >
                    <Link className="text-sm" href={`/article/${a.id}`}>
                        {a.title}
                    </Link>
                    <p className="text-xs">{a.views} views</p>
                </div>
            ))}
        </div>
    );
}

export function TopUpvotedArticle({ article }: { article: ArticleWithScore }) {
    return (
        <div className="border rounded-2xl bg-card px-2 shadow">
            <h1 className="font-heading text-base font-medium">Most upvoted article</h1>
            <div
                key={article.a.id}
                className="text-black border rounded-2xl bg-chart-2 py-2 px-2 my-2 text-center"
            >
                <Link className="text-sm" href={`/article/${article.a.id}`}>
                    {article.a.title}
                </Link>
                <p className="text-xs">{article.totalScore} upvotes</p>
            </div>
        </div>
    );
}
