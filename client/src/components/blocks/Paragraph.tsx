import React from "react";
import { ParagraphProps } from "@/types";
import ReactMarkdown from "react-markdown";

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="copy article-paragraph">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
