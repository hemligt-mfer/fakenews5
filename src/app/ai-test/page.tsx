"use client";

import { useState } from "react";
import { generateResponse } from "./ai";
import Markdown from "react-markdown";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");
    return (
        <div>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button
                onClick={async () => {
                    setIsLoading(true);
                    setResult(await generateResponse(prompt));
                    setIsLoading(false);
                }}
            >
                Generate
            </button>
            {isLoading && <p>Loading ...</p>}
            {result && (
                <article className="prose">
                    <Markdown>{result}</Markdown>
                </article>
            )}
        </div>
    );
}
