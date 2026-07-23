"use client";

import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "lexical";

export function RichText({
  data,
}: {
  data: unknown;
}) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-sans prose-headings:text-fg-default prose-a:text-primary hover:prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-p:text-fg-secondary prose-strong:text-fg-default">
      <PayloadRichText data={data as SerializedEditorState} />
    </div>
  );
}
