"use client";

import { useState } from "react";
import { generateResponse, RecipeWithImage } from "./ai";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RecipeWithImage | null>(null);
  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
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
        <div className="prose">
          <h2>{result.recipe.name}</h2>
          <img src={result.image} alt="Recipe image" />
          <p>{result.recipe.description}</p>
          <h3>Ingredients:</h3>
          <ul>
            {result.recipe.ingredients.map((i, index) => (
              <li key={index}>
                {i.name} {i.amount} {i.unit}
              </li>
            ))}
          </ul>
          <h3>Steps:</h3>
          <ul>
            {result.recipe.steps.map((s, index) => (
              <li key={index}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
