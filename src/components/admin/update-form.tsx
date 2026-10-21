"use client";

import { useActionState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { saveUpdate, type FormState } from "@/app/admin/actions";
import { PULSE_CATEGORIES } from "@/lib/pulse/categories";
import { SIGNAL_ROWS } from "@/lib/pulse/signal";
import type { PulseUpdate } from "@/lib/pulse/types";

const input = "mt-1 w-full rounded-xl border border-ink/40 bg-white px-3 py-2 text-sm outline-none focus:border-ink focus:shadow-[2px_2px_0_var(--color-blue)]";
const label = "block text-xs font-bold uppercase tracking-[0.08em]";

function Field({ name, title, defaultValue, hint, type = "text", required = false, area = false }: { name: string; title: string; defaultValue?: string; hint?: string; type?: string; required?: boolean; area?: boolean }) {
  return (
    <label className="block">
      <span className={label}>{title}{required && <span className="text-pink"> *</span>}</span>
      {area ? <textarea name={name} defaultValue={defaultValue} required={required} rows={3} className={input} /> : <input name={name} type={type} defaultValue={defaultValue} required={required} className={input} />}
      {hint && <span className="mt-0.5 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function UpdateForm({ update, saved }: { update?: PulseUpdate; saved?: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveUpdate, {});
  const list = (value?: string[]) => value?.join(", ") ?? "";

  return (
    <form action={action} className="space-y-8">
      {update && <input type="hidden" name="id" value={update.id} />}

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold md:col-span-2">Story</h2>
        <div className="md:col-span-2"><Field name="title" title="Headline" defaultValue={update?.title} required /></div>
        <label className="block"><span className={label}>Category <span className="text-pink">*</span></span>
          <select name="category" defaultValue={update?.category ?? "trending"} className={input}>{PULSE_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.emoji} {category.label}</option>)}</select>
        </label>
        <Field name="slug" title="URL slug" defaultValue={update?.slug} hint="Leave blank to generate from the headline." />
        <div className="md:col-span-2"><Field name="summary" title="Summary" defaultValue={update?.summary} required area /></div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5">
        <h2 className="font-display text-2xl font-semibold">Impact Signal</h2>
        {SIGNAL_ROWS.map((row) => <Field key={row.key} name={`signal.${row.key}`} title={`${row.label} ${row.question}`} defaultValue={update?.signal[row.key]} required area />)}
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold md:col-span-2">Source & verification</h2>
        <Field name="sourceName" title="Original source" defaultValue={update?.sourceName} required />
        <div>
          <Field name="sourceUrl" title="Source URL" type="url" defaultValue={update?.sourceUrl} hint="Required for verified items." />
          {update?.sourceUrl && <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold underline">Inspect source<ArrowUpRight className="h-3 w-3" /></a>}
        </div>
        <label className="block"><span className={label}>Verification</span>
          <select name="verification" defaultValue={update?.verification ?? "unverified"} className={input}>
            <option value="unverified">Not yet verified</option>
            <option value="verified">Verified (source checked)</option>
          </select>
        </label>
        <Field name="lastVerifiedAt" title="Last verified" type="date" defaultValue={update?.lastVerifiedAt} />
        <Field name="publishedAt" title="Publication date" type="date" defaultValue={update?.publishedAt} />
        <Field name="deadline" title="Application deadline" type="date" defaultValue={update?.deadline} hint="Hidden from readers the day after." />
        <Field name="expiresAt" title="Expiry date" type="date" defaultValue={update?.expiresAt} />
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold md:col-span-2">Audience, skills & eligibility</h2>
        <Field name="skills" title="Relevant skills" defaultValue={list(update?.skills)} hint="Comma-separated. Powers Impact Radar." />
        <Field name="tags" title="Tags" defaultValue={list(update?.tags)} />
        <Field name="audience" title="Target audience" defaultValue={list(update?.audience)} />
        <Field name="location" title="Location" defaultValue={update?.location} />
        <div className="md:col-span-2"><Field name="eligibility" title="Eligibility" defaultValue={update?.eligibility} area /></div>
        <Field name="relatedCourseSlugs" title="Related Academy course slugs" defaultValue={list(update?.relatedCourseSlugs)} hint="e.g. excel-dashboards-for-beginners" />
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold md:col-span-2">Job details <span className="text-sm font-normal text-muted">(jobs & gigs only)</span></h2>
        <Field name="job.company" title="Company" defaultValue={update?.job?.company} />
        <Field name="job.location" title="Job location" defaultValue={update?.job?.location} />
        <label className="block"><span className={label}>Remote</span>
          <select name="job.remote" defaultValue={update?.job?.remote ?? ""} className={input}><option value="">—</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select>
        </label>
        <Field name="job.employmentType" title="Employment type" defaultValue={update?.job?.employmentType} />
      </section>

      <section className="grid gap-4 rounded-3xl border border-ink bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold md:col-span-2">Call to action & publishing</h2>
        <Field name="cta.label" title="CTA label" defaultValue={update?.cta.label} required hint="e.g. Apply now, Build this skill, Explore trend" />
        <Field name="cta.href" title="CTA destination" defaultValue={update?.cta.href} required hint="/academy/… or https://…" />
        <label className="block"><span className={label}>Status</span>
          <select name="status" defaultValue={update?.status ?? "draft"} className={input}>
            <option value="draft">Draft</option><option value="pending_review">Pending review</option><option value="published">Published</option><option value="expired">Expired</option><option value="archived">Archived</option><option value="rejected">Rejected</option>
          </select>
        </label>
        <label className="block"><span className={label}>Card size</span>
          <select name="size" defaultValue={update?.size ?? "standard"} className={input}><option value="feature">Feature</option><option value="standard">Standard</option><option value="compact">Compact</option></select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={update?.featured} className="h-4 w-4" />Featured story</label>
        <div className="md:col-span-2"><Field name="reviewNote" title="Internal review note" defaultValue={update?.reviewNote} area /></div>
      </section>

      <div className="sticky bottom-20 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-ink bg-white p-3 shadow-[4px_4px_0_#111] md:bottom-4">
        <button type="submit" disabled={pending} className="im-press rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white hover:bg-blue disabled:opacity-60">{pending ? "Saving…" : update ? "Save changes" : "Create update"}</button>
        {(state.ok || saved) && !state.errors?.length && <span role="status" className="inline-flex items-center gap-1 text-sm font-semibold text-blue"><CheckCircle2 className="h-4 w-4" />{state.message ?? "Saved."}</span>}
        {state.errors?.length ? <ul role="alert" className="w-full list-disc space-y-0.5 pl-5 text-sm text-pink">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
      </div>
    </form>
  );
}
