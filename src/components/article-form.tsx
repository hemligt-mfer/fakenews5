"use client";

import { useActionState, useState } from "react";
import { Editor } from "@/components/tiptap";
import {
  saveArticle,
  type SaveArticleState,
  type SavedArticle,
} from "../../src/_actions/save-article";

const initialState: SaveArticleState = { ok: false, message: "" };

export function ArticleForm() {
  // Each editor reports its content as markdown; we keep it here and ship it
  // to the server through a hidden input so the whole form submits at once.
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [state, formAction, pending] = useActionState(
    saveArticle,
    initialState,
  );

  return (
    <div className="flex flex-col gap-8">
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700">
          Heading
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Article heading"
          className="rounded-md border border-zinc-300 px-3 py-2 text-lg font-semibold text-zinc-900 placeholder:text-zinc-500 placeholder:font-normal focus:border-zinc-500 focus:outline-none"
        />
        {state.errors?.title && (
          <p className="text-sm text-red-600">{state.errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">
          Summary / Description
        </span>
        <Editor
          onChange={setSummary}
          minHeightClass="min-h-[6rem]"
          placeholder="A short description used in listings and previews"
        />
        <input type="hidden" name="summary" value={summary} />
        {state.errors?.summary && (
          <p className="text-sm text-red-600">{state.errors.summary}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">Content</span>
        <Editor onChange={setContent} placeholder="Write your article …" />
        {/* The editor is a contenteditable, not a form field, so mirror its
            markdown into a hidden input that the form can submit. */}
        <input type="hidden" name="content" value={content} />
        {state.errors?.content && (
          <p className="text-sm text-red-600">{state.errors.content}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save article"}
        </button>
        {state.message && (
          <p
            className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>

      {state.ok && state.article && (
        <ArticlePreview key={state.article.id} article={state.article} />
      )}
    </div>
  );
}

// Renders a saved article with its markdown turned back into formatted prose.
// `key`ing this on the article id (in the parent) remounts the read-only
// editors so they pick up the new content after each save.
function ArticlePreview({ article }: { article: SavedArticle }) {
  return (
    <article className="flex flex-col gap-4 border-t border-zinc-200 pt-8">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        Preview
      </p>
      <h2 className="text-3xl font-bold text-zinc-900">{article.title}</h2>
      <div className="text-lg text-zinc-600">
        <Editor initialMarkdown={article.summary} editable={false} />
      </div>
      <Editor initialMarkdown={article.content} editable={false} />
    </article>
  );
}