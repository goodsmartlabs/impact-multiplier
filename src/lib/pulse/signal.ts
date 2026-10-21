import type { ImpactSignal } from "./types";

export const SIGNAL_ROWS: Array<{ key: keyof ImpactSignal; label: string; question: string }> = [
  { key: "what", label: "What?", question: "What happened or what opportunity exists?" },
  { key: "why", label: "Why?", question: "Why is it important?" },
  { key: "who", label: "Who?", question: "Who should pay attention?" },
  { key: "how", label: "How?", question: "How can someone benefit?" },
  { key: "next", label: "Next?", question: "What practical action should they take?" },
];
