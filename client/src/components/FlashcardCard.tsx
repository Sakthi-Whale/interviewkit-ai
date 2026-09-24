"use client";

import { useState } from "react";
import api from "@/services/api";

interface Flashcard {
  question: string;
  answer: string;
  category: string;
}

interface Props {
  flashcards: Flashcard[];
  kitId: string;
}

export default function FlashcardCard({ flashcards, kitId }: Props) {
  const [cards, setCards] = useState(flashcards);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!cards.length) return null;

  const card = cards[active];

  const updateCard = (field: "question" | "answer", value: string) => {
    const updated = [...cards];
    updated[active] = { ...updated[active], [field]: value };
    setCards(updated);
  };

  const moveUp = () => {
    if (active === 0) return;
    const updated = [...cards];
    [updated[active - 1], updated[active]] = [
      updated[active],
      updated[active - 1],
    ];
    setCards(updated);
    setActive(active - 1);
  };

  const moveDown = () => {
    if (active === cards.length - 1) return;
    const updated = [...cards];
    [updated[active + 1], updated[active]] = [
      updated[active],
      updated[active + 1],
    ];
    setCards(updated);
    setActive(active + 1);
  };

  const deleteCard = () => {
    if (!window.confirm("Delete this flashcard?")) return;

    const updated = cards.filter((_, i) => i !== active);
    setCards(updated);

    if (active >= updated.length) {
      setActive(Math.max(updated.length - 1, 0));
    }

    setFlipped(false);
    setEditing(false);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);

      await api.patch(`/kits/${kitId}/flashcards`, {
        flashcards: cards,
      });

      setEditing(false);
      alert("Flashcards updated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-white">
          AI Flashcards
        </h2>

        <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
          {cards.length === 0 ? 0 : active + 1} / {cards.length}
        </span>
      </div>

      <div className="bg-slate-800 rounded-xl p-8 min-h-[240px]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-purple-400 text-sm">
            {card.category}
          </span>

          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-400 text-sm"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editing ? (
          <>
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
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">
                Question
              </label>
              <textarea
                rows={3}
                value={card.question}
                onChange={(e) =>
                  updateCard("question", e.target.value)
                }
                className="w-full mt-2 bg-slate-900 rounded-lg p-3 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">
                Answer
              </label>
              <textarea
                rows={4}
                value={card.answer}
                onChange={(e) =>
                  updateCard("answer", e.target.value)
                }
                className="w-full mt-2 bg-slate-900 rounded-lg p-3 border border-slate-700 text-white"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <button
          onClick={() => setFlipped(!flipped)}
          disabled={editing}
          className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {flipped ? "Show Question" : "Flip Card"}
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setActive((prev) =>
              prev === cards.length - 1 ? 0 : prev + 1
            );
          }}
          disabled={editing}
          className="bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          Next Card
        </button>

        <button
          onClick={moveUp}
          disabled={editing || active === 0}
          className="bg-slate-700 py-3 rounded-xl disabled:opacity-40"
        >
          ↑ Move Up
        </button>

        <button
          onClick={moveDown}
          disabled={editing || active === cards.length - 1}
          className="bg-slate-700 py-3 rounded-xl disabled:opacity-40"
        >
          ↓ Move Down
        </button>

        <button
          onClick={deleteCard}
          className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
        >
          Delete
        </button>

        <button
          onClick={saveChanges}
          disabled={!editing || saving}
          className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}