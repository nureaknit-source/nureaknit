"use client";

import { useState } from "react";
import { RichText } from "@/components/shared/rich-text";

interface FAQItem {
  id: number;
  question: string;
  answer: Record<string, unknown>;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="mt-8 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-border bg-bg-surface"
        >
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:opacity-90"
            aria-expanded={openId === item.id}
          >
            <span className="font-sans text-lg font-bold text-fg-default">
              {item.question}
            </span>
            <svg
              className={`h-5 w-5 text-fg-muted transition ${
                openId === item.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openId === item.id && (
            <div className="border-t border-border px-6 py-4">
              <RichText data={item.answer} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
