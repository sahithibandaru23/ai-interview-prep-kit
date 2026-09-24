"use client";

import { API_URL } from "../../../lib/api";
import { useEffect, useState } from "react";

interface Requirement {
  id: string;
  text: string;
  kind: string;
  priority: string;
}

interface Question {
  id: string;
  requirement_ids: string[];
  category: string;
  prompt: string;
  answer_outline: string;
  difficulty: number;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  requirement_ids: string[];
}

interface ScheduleDay {
  day: number;
  focus: string;
  question_ids: string[];
  minutes: number;
}

interface Kit {
  _id: string;
  source: {
    company: string;
    company_url: string;
    role: string;
    location: string;
    jd_chars: number;
  };
  company_brief: {
    summary: string;
    what_they_do: string;
    sources: string[];
  };
  role: {
    title: string;
    seniority: string;
    responsibilities: string[];
    requirements: Requirement[];
  };
  questions: Question[];
  flashcards: Flashcard[];
  schedule: {
    days_available: number;
    days: ScheduleDay[];
  };
  coverage: {
    uncovered_requirement_ids: string[];
    passes: number;
  };
  status: string;
}

export default function KitDetails() {
  const [kit, setKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const id = window.location.pathname.split("/").pop();

    fetch(`${API_URL}/api/kits/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load kit");
        }

        return data;
      })
      .then((data) => {
        setKit(data.kit);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-400">
            Loading your interview kit...
          </p>
        </div>
      </main>
    );
  }

  if (error || !kit) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-white">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-4 text-xl font-bold">
            Unable to load kit
          </h1>

          <p className="mt-2 text-sm text-red-300">
            {error || "Kit not found"}
          </p>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const coverageComplete =
    kit.coverage.uncovered_requirement_ids.length === 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
              AI
            </div>

            <div className="text-left">
              <p className="font-bold">InterviewPrep</p>
              <p className="text-xs text-slate-400">
                Interview preparation
              </p>
            </div>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                window.location.href = "/assistant";
              }}
              className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20"
            >
              ✨ AI Assistant
            </button>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900 p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  ● {kit.status}
                </div>

                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                  {kit.role.title || "Interview Preparation"}
                </h1>

                <p className="mt-3 text-lg text-slate-300">
                  {kit.source.company || "Company"}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    📍 {kit.source.location || "Not specified"}
                  </span>

                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    📅 {kit.schedule.days_available} days
                  </span>

                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    🎯 {kit.questions.length} questions
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {coverageComplete ? "100%" : "Review"}
                </div>

                <p className="mt-1 text-xs text-green-300">
                  Requirement coverage
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm text-slate-400">
              Requirements
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {kit.role.requirements.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm text-slate-400">
              Questions
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-400">
              {kit.questions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm text-slate-400">
              Flashcards
            </p>
            <p className="mt-2 text-3xl font-bold text-pink-400">
              {kit.flashcards.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
            <p className="text-sm text-slate-400">
              Study Plan
            </p>
            <p className="mt-2 text-3xl font-bold text-green-400">
              {kit.schedule.days_available}
            </p>
            <p className="text-xs text-slate-500">
              days
            </p>
          </div>
        </section>

        {/* COMPANY BRIEF */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
              🏢
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Company Brief
              </h2>

              <p className="text-sm text-slate-400">
                What you should know before the interview
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl bg-white/[0.04] p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                Summary
              </p>

              <p className="text-sm leading-6 text-slate-300">
                {kit.company_brief.summary ||
                  "Company information was not available."}
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.04] p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
                What they do
              </p>

              <p className="text-sm leading-6 text-slate-300">
                {kit.company_brief.what_they_do ||
                  "Company information was not available."}
              </p>
            </div>
          </div>
        </section>

        {/* ROLE */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
              💼
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Role Breakdown
              </h2>

              <p className="text-sm text-slate-400">
                Responsibilities and requirements extracted from the JD
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">
              Responsibilities
            </h3>

            <div className="grid gap-2">
              {kit.role.responsibilities.map(
                (responsibility, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                  >
                    <span className="mr-2 text-blue-400">
                      →
                    </span>
                    {responsibility}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-7">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">
              Requirements
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              {kit.role.requirements.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-blue-400">
                      {req.id}
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                        req.priority === "must"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {req.priority}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-200">
                    {req.text}
                  </p>

                  <p className="mt-2 text-xs capitalize text-slate-500">
                    {req.kind}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUESTIONS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-xl">
              ❓
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Interview Questions
              </h2>

              <p className="text-sm text-slate-400">
                AI-generated questions mapped to your requirements
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kit.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-blue-500/30"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    Q{index + 1}
                  </span>

                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs capitalize text-purple-300">
                    {question.category}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                    Difficulty {question.difficulty}/5
                  </span>
                </div>

                <h3 className="mt-4 font-semibold leading-6 text-white">
                  {question.prompt}
                </h3>

                <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-400">
                    Answer Outline
                  </p>

                  <p className="text-sm leading-6 text-slate-300">
                    {question.answer_outline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FLASHCARDS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-xl">
              🧠
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Flashcards
              </h2>

              <p className="text-sm text-slate-400">
                Quick revision before your interview
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {kit.flashcards.map((card, index) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <span className="text-xs font-semibold text-pink-400">
                  CARD {index + 1}
                </span>

                <h3 className="mt-3 font-semibold text-white">
                  {card.front}
                </h3>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-sm leading-6 text-slate-400">
                    {card.back}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SCHEDULE */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-xl">
              📅
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Preparation Schedule
              </h2>

              <p className="text-sm text-slate-400">
                Your day-by-day interview preparation plan
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {kit.schedule.days.map((day) => (
              <div
                key={day.day}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
                  {day.day}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                    Day {day.day}
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {day.focus}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {day.question_ids.length} questions
                  </p>
                </div>

                <div className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300">
                  ⏱ {day.minutes} min
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="mt-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 text-center">
          <h2 className="text-xl font-bold">
            Need help preparing?
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Ask your AI Interview Assistant for explanations,
            mock questions, or interview tips.
          </p>

          <button
            onClick={() => {
              window.location.href = "/assistant";
            }}
            className="mt-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-blue-500/20"
          >
            ✨ Ask AI Interview Assistant
          </button>
        </section>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="mt-8 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 hover:bg-white/10"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
