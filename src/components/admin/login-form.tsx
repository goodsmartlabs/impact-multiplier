"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-full border border-ink px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_var(--color-blue)]" />
      </label>
      {state.errors?.length ? <p role="alert" className="rounded-2xl bg-pink-dim p-3 text-sm">{state.errors.join(" ")}</p> : null}
      <button type="submit" disabled={pending} className="im-press w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-blue disabled:opacity-60">{pending ? "Checking…" : "Sign in"}</button>
    </form>
  );
}
