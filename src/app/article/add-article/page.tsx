"use client";

import AddArticleForm from "./_components/add-article-form";

export default function AddArticlePage() {
  return (
    <div className="w-full">
      <div className="flex items-center ml-5">
        <h1 className="text-3xl text-red-600">/</h1>
        <h1 className="text-2xl text-muted-foreground">Add article</h1>
      </div>

      <div className="flex pt-10">
        <AddArticleForm />
      </div>
    </div>
  );
}
