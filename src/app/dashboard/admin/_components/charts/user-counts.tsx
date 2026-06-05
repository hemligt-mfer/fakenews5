"use client";

import Link from "next/link";

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
    <div className="border rounded-2xl bg-card px-4">
      <h1 className="font-heading text-base font-medium">
        Latest registered users
      </h1>
      {data.data.map((u) => (
        <div
          key={u.id}
          className="border rounded-full bg-chart-3 py-2 px-2 m-4 text-center"
        >
          <Link
            className="text-sm text-muted-foreground"
            href={`/dashboard/admin/users/${u.id}`}
          >
            {u.name}
          </Link>
          <p className="text-xs text-muted-foreground">
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
    <div className="border rounded-2xl bg-card p-4">
      <h1 className="font-heading text-base font-medium">Counts</h1>
      <div className="flex justify-between items-center border rounded-full bg-chart-3 px-4 py-1 m-4">
        <Link
          className="text-sm text-muted-foreground"
          href={"/dashboard/admin/articles"}
        >
          Articles
        </Link>
        <span className="bg-chart-1 rounded-full p-1 ml-2">{articleCount}</span>
      </div>

      <div className="flex justify-between items-center border rounded-full bg-chart-3 px-4 py-1 m-4">
        <Link
          className="text-sm text-muted-foreground"
          href={"/dashboard/admin/users"}
        >
          Users
        </Link>
        <span className="bg-chart-1 rounded-full p-1 ml-2">{userCount}</span>
      </div>

      <div className="flex justify-between items-center border rounded-full bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">Comments</p>
        <span className="bg-chart-1 rounded-full p-1 ml-2">{comments}</span>
      </div>
    </div>
  );
}

export function TopCommenter({ user, commentCount }: Propsu) {
  return (
    <div className="border rounded-2xl bg-card px-4 max-h-40">
      <h1 className="font-heading text-base font-medium">Top commenter</h1>
      <div className="flex justify-between items-center border rounded-full bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">
          {!user ? "" : user.name}
        </p>
        <span className="bg-chart-1 rounded-full p-1 ml-2">{commentCount}</span>
      </div>
    </div>
  );
}

export function TopViewedArticles({ articles }: TopViewedProps) {
  return (
    <div className="border rounded-2xl bg-card px-4 max-h-40">
      <h1 className="font-heading text-base font-medium">
        Most viewed article
      </h1>
      {articles.map((a) => (
        <div
          key={a.articleId}
          className="border rounded-full bg-chart-3 py-2 px-2 m-4 text-center"
        >
          <Link
            className="text-sm text-muted-foreground"
            href={`/article/${a.articleId}`}
          >
            {a.title}
          </Link>
          <p className="text-xs text-muted-foreground">{a.views} views</p>
        </div>
      ))}
    </div>
  );
}

export function TopLikedArticles({ likes }: Likes) {
  return (
    <div className="border rounded-2xl bg-card px-4">
      <h1 className="font-heading text-base font-medium">
        Most upvoted articles
      </h1>
      {likes.map((l) => (
        <div
          key={l.articleId}
          className="border rounded-full bg-chart-2 py-2 px-2 m-4 text-center"
        >
          <Link href={`/article/${l.articleId}`}>{l.title}</Link>
          <p className="text-xs text-muted-foreground">{l.likes} Likes</p>
        </div>
      ))}
    </div>
  );
}
