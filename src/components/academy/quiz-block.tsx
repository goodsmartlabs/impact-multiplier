"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuizBlock({
  quiz,
  onComplete,
}: {
  quiz: Quiz;
  onComplete?: (scorePercent: number) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);

  return (
    <div className="rounded-2xl border border-line bg-cream p-5">
      <div className="space-y-6">
        {quiz.questions.map((q, qi) => (
          <div key={q.id}>
            <p className="mb-2 text-sm font-semibold text-ink">
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-1.5">
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi;
                const isCorrect = submitted && oi === q.correctIndex;
                const isWrongSelected = submitted && selected && oi !== q.correctIndex;
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                      selected && !submitted && "border-ink",
                      !selected && !submitted && "border-line hover:border-ink/40",
                      isCorrect && "border-blue bg-blue-dim text-blue",
                      isWrongSelected && "border-pink bg-pink-dim text-pink"
                    )}
                  >
                    {opt}
                    {isCorrect && <Check className="h-4 w-4" />}
                    {isWrongSelected && <X className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => {
            setSubmitted(true);
            onComplete?.(scorePercent);
          }}
          className="mt-5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper disabled:opacity-30"
        >
          Submit
        </button>
      ) : (
        <p className="mt-5 text-sm font-semibold text-ink">
          You got {correctCount} of {quiz.questions.length} correct ({scorePercent}%).
        </p>
      )}
    </div>
  );
}
