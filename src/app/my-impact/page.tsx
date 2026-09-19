"use client";

import { type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import { Award, Hammer, Lightbulb, Sparkles, TrendingUp, Users } from "lucide-react";
import { useImpactMovesStore } from "@/lib/store/impact-moves-store";
import { useAcademyStore } from "@/lib/store/academy-store";
import { getCourseBySlug } from "@/lib/data/courses";
import { useProfileStore } from "@/lib/store/profile-store";
import { useHydrated } from "@/lib/use-hydrated";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 text-center">
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
  empty,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
  empty: boolean;
}) {
  return (
    <section className="rounded-3xl border border-line bg-paper p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h2>
      </div>
      {empty ? (
        <p className="text-sm text-muted">Nothing here yet.</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}

export default function MyImpactPage() {
  const mounted = useHydrated();
  const moves = useImpactMovesStore((s) => s.moves);
  const enrollments = useAcademyStore((s) => s.enrollments);
  const name = useProfileStore((s) => s.name);

  if (!mounted) return null;

  const inProgress = moves.filter((m) => m.status === "in_progress");
  const completed = moves.filter((m) => m.status === "completed");
  const completedCourses = enrollments.filter((e) => e.completed);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 md:px-6 md:pt-10">
      <div className="mb-6 max-w-2xl">
        <h1 className="font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          {name}&apos;s Impact
        </h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          Proven capability, not just intentions. Learning and proof are kept separate.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Impact Moves Completed" value={completed.length} />
        <StatTile label="Courses Completed" value={completedCourses.length} />
        <StatTile label="Currently Increasing" value={inProgress.length} />
        <StatTile
          label="Proof Projects"
          value={completed.filter((m) => m.proof?.completed).length}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SectionCard icon={Sparkles} title="Currently Increasing" empty={inProgress.length === 0}>
          {inProgress.map((m) => (
            <Link
              key={m.id}
              href={`/impact-moves/${m.id}`}
              className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm hover:border-ink"
            >
              <span className="text-ink">{m.title}</span>
              <span className="text-xs capitalize text-muted">{m.currentStage}</span>
            </Link>
          ))}
        </SectionCard>

        <SectionCard icon={Award} title="Proven Capabilities" empty={completed.length === 0}>
          {completed
            .filter((m) => m.capacity?.after)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm">
                <p className="text-ink">{m.capacity?.after}</p>
                <p className="mt-0.5 text-xs text-muted">from “{m.title}” — proven</p>
              </div>
            ))}
        </SectionCard>

        <SectionCard icon={Award} title="Courses Completed" empty={completedCourses.length === 0}>
          {completedCourses.map((e) => {
            const course = getCourseBySlug(e.courseSlug);
            if (!course) return null;
            return (
              <Link
                key={e.courseSlug}
                href={`/academy/${course.slug}`}
                className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm hover:border-ink"
              >
                <span className="text-ink">{course.title}</span>
                <span className="text-xs text-muted">
                  {e.completedAt ? new Date(e.completedAt).toLocaleDateString() : ""}
                </span>
              </Link>
            );
          })}
        </SectionCard>

        <SectionCard
          icon={Hammer}
          title="Proof Projects"
          empty={completed.filter((m) => m.proof?.plan).length === 0}
        >
          {completed
            .filter((m) => m.proof?.plan)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm">
                <p className="text-ink">{m.proof?.plan}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {m.proof?.completed ? "Completed" : "Planned"} — from “{m.title}”
                </p>
              </div>
            ))}
        </SectionCard>

        <SectionCard
          icon={Hammer}
          title="Things Built"
          empty={completed.filter((m) => m.build?.what).length === 0}
        >
          {completed
            .filter((m) => m.build?.what)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm text-ink">
                {m.build?.what}
              </div>
            ))}
        </SectionCard>

        <SectionCard
          icon={Users}
          title="People / Problems Helped"
          empty={completed.filter((m) => m.value?.person).length === 0}
        >
          {completed
            .filter((m) => m.value?.person)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm">
                <p className="text-ink">{m.value?.person}</p>
                <p className="mt-0.5 text-xs text-muted">{m.value?.problem}</p>
              </div>
            ))}
        </SectionCard>

        <SectionCard
          icon={TrendingUp}
          title="Economic Impact"
          empty={completed.filter((m) => m.impact?.economicResult).length === 0}
        >
          {completed
            .filter((m) => m.impact?.economicResult)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm text-ink">
                {m.impact?.economicResult}
              </div>
            ))}
        </SectionCard>

        <SectionCard
          icon={Lightbulb}
          title="Next Multipliers"
          empty={completed.filter((m) => m.multiply?.whatsNext).length === 0}
        >
          {completed
            .filter((m) => m.multiply?.whatsNext)
            .map((m) => (
              <div key={m.id} className="rounded-xl border border-line px-3 py-2 text-sm text-ink">
                {m.multiply?.whatsNext}
              </div>
            ))}
        </SectionCard>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">
        Public Impact Profiles — where your proven capabilities could become a shareable
        professional identity — are coming in a future version.
      </div>
    </div>
  );
}
