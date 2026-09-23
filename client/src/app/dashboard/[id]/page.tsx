/*this file is a page that displays the details of a specific interview kit. It fetches the kit data from the server using the kit ID from the URL parameters and displays various sections such as coverage, company brief, job skills, roadmap, and flashcards. It also provides a delete button to remove the kit.*/

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";

import CoverageCard from "@/components/CoverageCard";
import CompanyBriefCard from "@/components/CompanyBriefCard";
import RoadmapCard from "@/components/RoadmapCard";
import FlashcardCard from "@/components/FlashcardCard";

import { useRouter } from "next/navigation";

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

export default function KitDetails() {
  const params = useParams();
  const router = useRouter();

  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);

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

        {/* Flashcards */}
        <FlashcardCard flashcards={kit.flashcards || []} />

      </div>
    </main>
  );
}