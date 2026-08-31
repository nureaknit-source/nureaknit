import { HTMLAttributes, forwardRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  display?: boolean;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight",
  h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight",
  h3: "text-lg sm:text-xl md:text-2xl font-bold tracking-normal",
  h4: "text-base sm:text-lg md:text-xl font-bold",
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
  sm: "text-xs sm:text-sm",
  base: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
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
      } text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-fg-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Caption.displayName = "Caption";
