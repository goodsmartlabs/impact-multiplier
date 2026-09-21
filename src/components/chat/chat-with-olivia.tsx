"use client";

import { FormEvent, useState } from "react";
import { ChevronDown, MessageCircle, Send, X } from "lucide-react";
import { oliviaChatProvider } from "@/lib/chat-provider";

const CHAT_STORAGE_KEY = "impactfools-olivia-chat-draft";
const PROMPTS = ["Ask about a course", "Ask about a service", "Need help choosing?"] as const;

export function ChatWithOlivia() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "not_configured" | "error">("idle");

  function updateDraft(value: string) {
    setDraft(value);
    window.localStorage.setItem(CHAT_STORAGE_KEY, value);
    if (status !== "idle") setStatus("idle");
  }

  function toggleChat() {
    if (!open && !draft) setDraft(window.localStorage.getItem(CHAT_STORAGE_KEY) ?? "");
    setOpen((current) => !current);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || status === "sending") return;

    setStatus("sending");
    try {
      const result = await oliviaChatProvider.send(message);
      setStatus(result.status);
      if (result.status === "sent") {
        setDraft("");
        window.localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <aside className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6" aria-label="Chat with Olivia">
      {open ? (
        <div className="w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-ink bg-paper shadow-[7px_7px_0_#111]">
          <div className="flex items-center justify-between border-b border-ink bg-pink-dim px-4 py-3">
            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink bg-pink text-white"><MessageCircle className="h-4 w-4" /></span><div><p className="text-sm font-bold">Chat with Olivia</p><p className="text-[10px] text-muted">Keep browsing while you write</p></div></div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white" aria-label="Minimize chat"><ChevronDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => { setOpen(false); updateDraft(""); }} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white" aria-label="Close chat and clear draft"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="p-4">
            <p className="font-display text-2xl font-semibold leading-none">What are you trying to make?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => updateDraft(prompt)} className="rounded-full border border-ink bg-blue-dim px-3 py-1.5 text-[10px] font-semibold hover:bg-pink-dim">{prompt}</button>)}
            </div>

            <form className="mt-4" onSubmit={handleSubmit}>
              <label htmlFor="olivia-chat-message" className="sr-only">Your question for Olivia</label>
              <textarea id="olivia-chat-message" value={draft} onChange={(event) => updateDraft(event.target.value)} rows={4} maxLength={1000} placeholder="Type your question…" className="w-full resize-none rounded-2xl border border-ink bg-white p-3 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_#0964f5]" />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] text-muted">Draft stays here if minimized.</span>
                <button type="submit" disabled={!draft.trim() || status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{status === "sending" ? "Sending…" : "Send"}<Send className="h-3.5 w-3.5" /></button>
              </div>
            </form>

            <div aria-live="polite" className="mt-3 min-h-5 text-[11px] leading-relaxed">
              {status === "sent" ? <p className="text-blue">Message sent. Olivia can continue from here.</p> : null}
              {status === "not_configured" ? <p className="rounded-xl bg-pink-dim p-2">Live delivery is not connected yet. Your draft is saved here and was not sent.</p> : null}
              {status === "error" ? <p className="rounded-xl bg-pink-dim p-2">That message could not be sent. Your draft is still saved.</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <button type="button" onClick={toggleChat} aria-expanded={open} className="design-sticker inline-flex items-center gap-2 rounded-full border border-ink bg-pink px-4 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#111] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
        <MessageCircle className="h-5 w-5" /> Chat with Olivia
      </button>
    </aside>
  );
}
