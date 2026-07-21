"use client";

import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

export function RichText({
  data,
}: {
  data: unknown;
}) {
  return (
    <div className="prose prose-sm prose-charcoal max-w-none prose-headings:font-serif prose-headings:text-charcoal prose-a:text-sage prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
      <PayloadRichText data={data as SerializedEditorState} />
    </div>
  );
}
