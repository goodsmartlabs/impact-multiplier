"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  placeholder = "What do you want to increase?",
  autoFocus = false,
  initialValue = "",
}: {
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
      className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3.5 shadow-sm transition-colors focus-within:border-ink"
    >
      <Search className="h-5 w-5 shrink-0 text-muted" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full bg-transparent text-base outline-none placeholder:text-muted"
      />
    </form>
  );
}
