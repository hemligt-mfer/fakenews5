"use client";

import { Markdown } from "@tiptap/markdown";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { Editor as TiptapEditor } from "@tiptap/react";
import React, { Fragment } from "react";

interface EditorProps {
  initialMarkdown?: string;
  onChange?: (markdown: string) => void;
  // Tailwind class controlling the editable area's min height, so the same
  // editor can be tall (article body) or short (summary). Defaults to tall.
  minHeightClass?: string;
  // Greyed-out hint shown while the editor is empty.
  placeholder?: string;
  // When false the editor is read-only and the toolbar is hidden — useful for
  // rendering saved markdown as formatted prose. Defaults to true (editing).
  editable?: boolean;
}

type ToolbarItem = {
  label: string;
  content: React.ReactNode;
  run: (editor: TiptapEditor) => void;
  isActive?: (editor: TiptapEditor) => boolean;
  isEnabled?: (editor: TiptapEditor) => boolean;
};

// Prompt for a URL and apply/clear the link mark. Empty input removes the link.
function promptForLink(editor: TiptapEditor) {
  const previous = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Link URL", previous ?? "");
  if (url === null) return; // cancelled
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

// Grouped toolbar. Each inner array is rendered as a section separated by a divider.
const Toolbar: ToolbarItem[][] = [
  [
    {
      label: "Undo",
      content: "↶",
      run: (e) => e.chain().focus().undo().run(),
      isEnabled: (e) => e.can().undo(),
    },
    {
      label: "Redo",
      content: "↷",
      run: (e) => e.chain().focus().redo().run(),
      isEnabled: (e) => e.can().redo(),
    },
  ],
  [
    {
      label: "Paragraph",
      content: "¶",
      run: (e) => e.chain().focus().setParagraph().run(),
      isActive: (e) => e.isActive("paragraph"),
    },
    {
      label: "Heading 1",
      content: "H1",
      run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (e) => e.isActive("heading", { level: 1 }),
    },
    {
      label: "Heading 2",
      content: "H2",
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (e) => e.isActive("heading", { level: 2 }),
    },
    {
      label: "Heading 3",
      content: "H3",
      run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (e) => e.isActive("heading", { level: 3 }),
    },
  ],
  [
    {
      label: "Bold",
      content: <span className="font-bold">B</span>,
      run: (e) => e.chain().focus().toggleBold().run(),
      isActive: (e) => e.isActive("bold"),
    },
    {
      label: "Italic",
      content: <span className="italic">I</span>,
      run: (e) => e.chain().focus().toggleItalic().run(),
      isActive: (e) => e.isActive("italic"),
    },
    {
      label: "Underline",
      content: <span className="underline">U</span>,
      run: (e) => e.chain().focus().toggleUnderline().run(),
      isActive: (e) => e.isActive("underline"),
    },
    {
      label: "Strikethrough",
      content: <span className="line-through">S</span>,
      run: (e) => e.chain().focus().toggleStrike().run(),
      isActive: (e) => e.isActive("strike"),
    },
    {
      label: "Inline code",
      content: <span className="font-mono">{"</>"}</span>,
      run: (e) => e.chain().focus().toggleCode().run(),
      isActive: (e) => e.isActive("code"),
    },
    {
      label: "Link",
      content: "🔗",
      run: (e) => promptForLink(e),
      isActive: (e) => e.isActive("link"),
    },
  ],
  [
    {
      label: "Bullet list",
      content: "•",
      run: (e) => e.chain().focus().toggleBulletList().run(),
      isActive: (e) => e.isActive("bulletList"),
    },
    {
      label: "Numbered list",
      content: "1.",
      run: (e) => e.chain().focus().toggleOrderedList().run(),
      isActive: (e) => e.isActive("orderedList"),
    },
    {
      label: "Blockquote",
      content: "❝",
      run: (e) => e.chain().focus().toggleBlockquote().run(),
      isActive: (e) => e.isActive("blockquote"),
    },
    {
      label: "Code block",
      content: "{ }",
      run: (e) => e.chain().focus().toggleCodeBlock().run(),
      isActive: (e) => e.isActive("codeBlock"),
    },
    {
      label: "Horizontal rule",
      content: "―",
      run: (e) => e.chain().focus().setHorizontalRule().run(),
    },
  ],
];

function ToolbarButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={[
        "min-w-8 rounded px-2 py-1 text-sm transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-zinc-800 text-white" : "text-zinc-700 hover:bg-zinc-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-zinc-300" />;
}

function MenuBar({ editor }: { editor: TiptapEditor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      Toolbar.flat().map((item) => ({
        active: item.isActive?.(editor) ?? false,
        enabled: item.isEnabled?.(editor) ?? true,
      })),
  });

  let i = 0;
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-300 bg-zinc-50 p-2">
      {Toolbar.map((group, g) => (
        <Fragment key={g}>
          {g > 0 && <Divider />}
          {group.map((item) => {
            const { active, enabled } = state[i++];
            return (
              <ToolbarButton
                key={item.label}
                label={item.label}
                active={active}
                disabled={!enabled}
                onClick={() => item.run(editor)}
              >
                {item.content}
              </ToolbarButton>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

export function Editor({
  initialMarkdown = "",
  onChange,
  minHeightClass = "min-h-[16rem]",
  placeholder = "Write something …",
  editable = true,
}: EditorProps) {
  const editor = useEditor({
    editable,
    extensions: [StarterKit, Markdown, Placeholder.configure({ placeholder })],
    content: initialMarkdown,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose max-w-none ${editable ? minHeightClass : ""} ${
          editable ? "px-4 py-3" : ""
        } focus:outline-none`,
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getMarkdown());
    },
  });

  if (!editor) return null;

  // Read-only: render the prose directly with no toolbar or border chrome.
  if (!editable) {
    return <EditorContent editor={editor} />;
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-zinc-300">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
