/*this file is a component that displays flashcards with a question and answer. It allows the user to flip the card to see the answer and navigate to the next card.*/

"use client";

import { useState } from "react";

interface Flashcard {
  question: string;
  answer: string;
  category: string;
}

interface Props {
  flashcards: Flashcard[];
}

export default function FlashcardCard({ flashcards }: Props) {
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[active];

  if (!flashcards.length) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-white">
          AI Flashcards
        </h2>

        <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
          {active + 1} / {flashcards.length}
        </span>
      </div>

      <div className="bg-slate-800 rounded-xl p-8 min-h-[220px] flex flex-col justify-center items-center text-center">
        <span className="text-purple-400 text-sm mb-4">
          {card.category}
        </span>

        {!flipped ? (
          <>
            <p className="text-slate-400 text-sm mb-2">
              Question
            </p>

            <h3 className="text-2xl font-bold text-white">
              {card.question}
            </h3>
          </>
        ) : (
          <>
            <p className="text-emerald-400 text-sm mb-2">
              Answer
            </p>

            <p className="text-lg text-slate-200 leading-8">
              {card.answer}
            </p>
          </>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setFlipped(!flipped)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
        >
          {flipped ? "Show Question" : "Flip Card"}
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setActive((prev) =>
              prev === flashcards.length - 1 ? 0 : prev + 1
            );
          }}
          className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-semibold"
        >
          Next Card
        </button>
      </div>
    </div>
  );
}