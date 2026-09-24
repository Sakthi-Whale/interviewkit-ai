"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

import CoverageCard from "@/components/CoverageCard";
import CompanyBriefCard from "@/components/CompanyBriefCard";
import RoadmapCard from "@/components/RoadmapCard";
import FlashcardCard from "@/components/FlashcardCard";

interface RoadmapDay {
  day: number;
  title: string;
  topics: string[];
  practiceTask: string;
}

interface Flashcard {
  question: string;
  answer: string;
  category: string;
}

interface Kit {
  companyUrl: string;
  preparationDays: number;
  status: string;
  jobDescription: string;
  parsedSkills: string[];

  companyBrief: {
    summary: string;
    what_they_do: string;
    hiring_process: string;
    tech_stack: string[];
  };

  coverage: {
    percentage: number;
    covered: string[];
    missing: string[];
  };

  flashcards: Flashcard[];

  roadmap: {
    roadmap: RoadmapDay[];
  }[];
}

type Confidence = "low" | "medium" | "high";

export default function KitDetails() {
  const params = useParams();
  const router = useRouter();

  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);

  // Practice Mode state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [confidence, setConfidence] = useState<
    Record<number, Confidence | null>
  >({});

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const res = await api.get(`/kits/${params.id}`);
        setKit(res.data.kit);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [params.id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Interview Kit?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/kits/${params.id}`);
      alert("Interview Kit deleted successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const progress = useMemo(() => {
    if (!kit?.flashcards?.length) return 0;

    const completed = Object.values(confidence).filter(Boolean).length;
    return Math.round((completed / kit.flashcards.length) * 100);
  }, [confidence, kit]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Interview Kit...
      </main>
    );
  }

  if (!kit) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Interview Kit not found.
      </main>
    );
  }

  const roadmap = kit.roadmap[0]?.roadmap || [];
  const cards = kit.flashcards || [];
  const activeCard = cards[currentQuestion];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-400 text-sm font-semibold">
              AI Interview Kit
            </p>

            <h1 className="text-3xl font-bold mt-2">
              {kit.companyUrl}
            </h1>

            <div className="flex gap-3 mt-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                {kit.preparationDays} Days
              </span>

              <span className="bg-emerald-600 px-3 py-1 rounded-full text-sm">
                {kit.status}
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
          >
            Delete
          </button>
        </div>

        {/* Coverage */}
        <CoverageCard
          percentage={kit.coverage?.percentage || 0}
          covered={kit.coverage?.covered || []}
          missing={kit.coverage?.missing || []}
        />

        {/* Company Brief */}
        <CompanyBriefCard
          summary={kit.companyBrief?.summary || ""}
          what_they_do={kit.companyBrief?.what_they_do || ""}
          hiring_process={kit.companyBrief?.hiring_process || ""}
          tech_stack={kit.companyBrief?.tech_stack || []}
        />

        {/* Job Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Extracted Job Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {kit.parsedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <RoadmapCard roadmap={roadmap} />

        {/* ================= PRACTICE MODE ================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Practice Mode
            </h2>
            <span className="text-sm text-slate-400">
              {progress}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full mb-6">
            <div
              className="h-3 bg-emerald-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {cards.length === 0 ? (
            <p className="text-slate-400">
              No practice questions available.
            </p>
          ) : (
            <>
              <div className="mb-2 text-sm text-slate-400">
                Question {currentQuestion + 1} of {cards.length}
              </div>

              <div className="bg-slate-800 rounded-xl p-5 mb-5">
                <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                  {activeCard.category}
                </span>

                <h3 className="text-xl font-semibold mt-4">
                  {activeCard.question}
                </h3>

                {showAnswer && (
                  <div className="mt-5 border-t border-slate-700 pt-4">
                    <p className="text-emerald-400 font-semibold mb-2">
                      Answer
                    </p>
                    <p className="text-slate-300">
                      {activeCard.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Show Answer */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold mb-5"
              >
                {showAnswer ? "Hide Answer" : "Reveal Answer"}
              </button>

              {/* Confidence */}
              {showAnswer && (
                <>
                  <p className="font-medium mb-3">
                    How confident were you?
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {(["low", "medium", "high"] as Confidence[]).map(
                      (level) => (
                        <button
                          key={level}
                          onClick={async () => {
                            setConfidence((prev) => ({
                             ...prev,
                             [currentQuestion]: level,
                       }));
 
                       await api.patch(`/kits/${params.id}/practice`, {
                        questionIndex: currentQuestion,
                        confidence: level,
                        });
                       }}
                          className={`py-3 rounded-xl font-semibold capitalize transition ${
                            confidence[currentQuestion] === level
                              ? level === "high"
                                ? "bg-emerald-600"
                                : level === "medium"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                              : "bg-slate-700 hover:bg-slate-600"
                          }`}
                        >
                          {level}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  disabled={currentQuestion === 0}
                  onClick={() => {
                    setCurrentQuestion((q) => q - 1);
                    setShowAnswer(false);
                  }}
                  className="px-5 py-2 bg-slate-700 rounded-xl disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={currentQuestion === cards.length - 1}
                  onClick={() => {
                    setCurrentQuestion((q) => q + 1);
                    setShowAnswer(false);
                  }}
                  className="px-5 py-2 bg-blue-600 rounded-xl disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Flashcards */}
        <FlashcardCard
          flashcards={kit.flashcards || []}
          kitId={params.id as string}
/>
      </div>
    </main>
  );
}