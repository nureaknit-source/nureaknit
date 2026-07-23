import { HTMLAttributes, forwardRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  display?: boolean;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: "text-4xl font-extrabold tracking-tight sm:text-5xl",
  h2: "text-3xl font-extrabold sm:text-4xl",
  h3: "text-2xl font-bold sm:text-3xl",
  h4: "text-xl font-bold",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", display = false, className = "", children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={`${display ? "font-display" : "font-sans"} text-fg-default ${headingStyles[Tag]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  ),
);
Heading.displayName = "Heading";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
}

const textStyles = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = "base", className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={`leading-relaxed text-fg-secondary ${textStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </p>
  ),
);
Text.displayName = "Text";

interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "sans" | "display";
}

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({ variant = "sans", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`${
        variant === "display" ? "font-display" : "font-sans"
      } text-xs font-bold uppercase tracking-widest text-fg-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Caption.displayName = "Caption";
