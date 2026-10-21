"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { saveEdition, type FormState } from "@/app/admin/actions";
import { BRIEF_SECTIONS } from "@/lib/pulse/newsletter";
import type { NewsletterEdition } from "@/lib/pulse/types";

const input = "mt-1 w-full rounded-xl border border-ink/40 bg-white px-3 py-2 text-sm outline-none focus:border-ink";

export function EditionForm({ edition, lines }: { edition: NewsletterEdition; lines: Record<string, string> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveEdition, {});
  return (
    <form action={action} className="space-y-4 rounded-3xl border border-ink bg-white p-5">
      <input type="hidden" name="id" value={edition.id} />
      <label className="block text-xs font-bold uppercase tracking-[0.08em]">Title<input name="title" defaultValue={edition.title} required className={input} /></label>
      <label className="block text-xs font-bold uppercase tracking-[0.08em]">Slug<input name="slug" defaultValue={edition.slug} required className={input} /></label>
      <label className="block text-xs font-bold uppercase tracking-[0.08em]">Intro<textarea name="intro" defaultValue={edition.intro} rows={3} className={input} /></label>
      <p className="text-xs text-muted">One item per line: <code>title | note | slug, /path or https://link</code></p>
      {BRIEF_SECTIONS.map((section) => (
        <label key={section.key} className="block text-xs font-bold uppercase tracking-[0.08em]">
          {section.title} <span className="font-normal normal-case text-muted">— {section.description}</span>
          <textarea name={`section.${section.key}`} defaultValue={lines[section.key] ?? ""} rows={Math.max(2, section.max)} className={`${input} font-mono text-xs`} />
        </label>
      ))}
      <label className="block text-xs font-bold uppercase tracking-[0.08em]">Status
        <select name="status" defaultValue={edition.status} className={input}><option value="draft">Draft</option><option value="published">Published (web archive)</option><option value="archived">Archived</option></select>
      </label>
      <button type="submit" disabled={pending} className="im-press rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{pending ? "Saving…" : "Save edition"}</button>
      {state.ok && <p role="status" className="flex items-center gap-1 text-sm font-semibold text-blue"><CheckCircle2 className="h-4 w-4" />{state.message}</p>}
      {state.errors?.length ? <ul role="alert" className="list-disc pl-5 text-sm text-pink">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
    </form>
  );
}
