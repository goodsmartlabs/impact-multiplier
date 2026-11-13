"use client";

import { useActionState } from "react";
import { saveIssueContent, type FormState } from "@/app/admin/actions";

/** Structured-content editor. The server re-validates everything before saving. */
export function IssueContentForm({ id, title, content, disabled }: { id: string; title: string; content: string; disabled: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveIssueContent, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label className="block text-sm font-semibold">Title
        <input name="title" defaultValue={title} disabled={disabled} className="mt-1 w-full rounded-xl border border-ink px-3 py-2 text-sm" />
      </label>
      <label className="block text-sm font-semibold">Content (JSON)
        <textarea name="content" defaultValue={content} disabled={disabled} rows={22} spellCheck={false} className="mt-1 w-full rounded-xl border border-ink p-3 font-mono text-xs" />
      </label>
      {state.errors?.length ? <ul role="alert" className="list-disc rounded-2xl bg-pink-dim p-3 pl-7 text-sm">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
      {state.message && <p role="status" className="rounded-2xl bg-blue-dim p-3 text-sm">{state.message}</p>}
      <button type="submit" disabled={disabled || pending} className="im-press rounded-full bg-ink px-4 py-2 text-sm font-bold text-white disabled:opacity-40">{pending ? "Saving…" : "Save changes"}</button>
      {disabled && <p className="text-xs text-muted">Published and archived issues are read-only.</p>}
    </form>
  );
}
