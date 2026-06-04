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
  user: { name: string | null} | null
  commentCount: number
}
export function LatestRegUsers(data: Props) {
  return (
    <div className="border rounded-2xl bg-card p-4">
      <h1 className="font-heading text-base font-medium">Latest registered users</h1>
      {data.data.map((u) => (
        <div key={u.id} className="border rounded-2xl bg-chart-3 py-2 px-2 m-4">
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
      <div className="flex justify-between items-center border rounded-2xl bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">Articles</p>
        <span className="bg-chart-1 rounded-full p-2">{articleCount}</span>
      </div>

      <div className="flex justify-between items-center border rounded-2xl bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">Users</p>
        <span className="bg-chart-1 rounded-full p-2">{userCount}</span>
      </div>

      <div className="flex justify-between items-center border rounded-2xl bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">Comments</p>
        <span className="bg-chart-1 rounded-full p-2">{comments}</span>
      </div>
    </div>
  );
}

export function TopCommenter({user, commentCount}: Propsu){
return (<div className="border rounded-2xl bg-card p-4 max-h-40">
    <h1 className="font-heading text-base font-medium">Top commenter</h1>
    <div className="flex justify-between items-center border rounded-2xl bg-chart-3 px-4 py-1 m-4">
        <p className="text-sm text-muted-foreground">{!user ? "" : user.name}</p>
        <span className="bg-chart-1 rounded-full p-2">{commentCount}</span>
      </div>
</div>)
}

