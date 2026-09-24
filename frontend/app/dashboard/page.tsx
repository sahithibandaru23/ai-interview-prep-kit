"use client";

import { API_URL } from "../../lib/api";
import { useEffect, useState } from "react";

interface Kit {
  _id: string;
  source: {
    company: string;
    role: string;
    location: string;
  };
  status: string;
  questions: unknown[];
  flashcards: unknown[];
  schedule: {
    days_available: number;
  };
  coverage: {
    uncovered_requirement_ids: string[];
    passes: number;
  };
}

export default function Dashboard() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("${API_URL}/api/kits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load kits");
        }

        return data;
      })
      .then((data) => {
        setKits(data.kits || []);
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
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-300">Loading your preparation kits...</p>
        </div>
      </main>
    );
  }

  const readyKits = kits.filter((kit) => kit.status === "ready").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold shadow-lg shadow-blue-500/20">
              AI
            </div>

            <div>
              <h1 className="font-bold tracking-tight">
                InterviewPrep
              </h1>

              <p className="text-xs text-slate-400">
                AI-powered preparation
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900 p-8 shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="max-w-2xl">
              <button
  onClick={() => {
    window.location.href = "/assistant";
  }}
  className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20 hover:text-white"
>
  ✨ AI Interview Assistant →
</button>

              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                Prepare smarter.
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Interview better.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-slate-300">
                Turn any job description into a personalized interview
                preparation plan with company research, questions,
                flashcards and a structured schedule.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/create";
                }}
                className="mt-7 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] hover:shadow-blue-500/30"
              >
                + Create Interview Kit
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm text-slate-400">Total Kits</p>
            <p className="mt-2 text-3xl font-bold">{kits.length}</p>
            <p className="mt-1 text-xs text-slate-500">
              Interview preparations
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm text-slate-400">Ready Kits</p>
            <p className="mt-2 text-3xl font-bold text-green-400">
              {readyKits}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Ready to study
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm text-slate-400">AI Generated</p>
            <p className="mt-2 text-3xl font-bold text-blue-400">
              {readyKits}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Personalized kits
            </p>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* KITS */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">
                YOUR PREPARATION
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Interview Kits
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              {kits.length} kit{kits.length !== 1 ? "s" : ""}
            </span>
          </div>

          {kits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                🧠
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                Your preparation starts here
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-400">
                Create your first interview kit and let AI build a
                personalized preparation plan.
              </p>

              <button
                onClick={() => {
                  window.location.href = "/create";
                }}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Create Your First Kit
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {kits.map((kit) => {
                const complete =
                  kit.coverage.uncovered_requirement_ids.length === 0;

                return (
                  <div
                    key={kit._id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.08]"
                  >
                    {/* top glow */}
                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
                            {(kit.source.company || "C").charAt(0)}
                          </div>

                          <div>
                            <h3 className="font-bold text-white">
                              {kit.source.role || "Interview Prep Kit"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                              {kit.source.company || "Company"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            kit.status === "ready"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {kit.status}
                        </span>
                      </div>

                      <div className="mt-6 space-y-3 text-sm">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <span className="text-slate-400">
                            Location
                          </span>

                          <span className="text-slate-200">
                            {kit.source.location || "Not specified"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <span className="text-slate-400">
                            Preparation
                          </span>

                          <span className="text-slate-200">
                            {kit.schedule.days_available} days
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">
                            Coverage
                          </span>

                          <span
                            className={
                              complete
                                ? "font-medium text-green-400"
                                : "font-medium text-yellow-400"
                            }
                          >
                            {complete ? "✓ Complete" : "Needs review"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          window.location.href = `/kits/${kit._id}`;
                        }}
                        className="mt-6 w-full rounded-xl border border-blue-500/30 bg-blue-500/10 py-3 font-semibold text-blue-300 transition hover:bg-blue-500 hover:text-white"
                      >
                        View Preparation →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
