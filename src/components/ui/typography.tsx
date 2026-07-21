import { HTMLAttributes, forwardRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingVariant = "serif" | "sans";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  variant?: HeadingVariant;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: "text-4xl font-semibold tracking-tight sm:text-5xl",
  h2: "text-3xl font-semibold sm:text-4xl",
  h3: "text-2xl font-semibold sm:text-3xl",
  h4: "text-xl font-semibold",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", variant = "serif", className = "", children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={`${
        variant === "serif" ? "font-serif" : "font-sans"
      } text-charcoal ${headingStyles[Tag]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  ),
);
Heading.displayName = "Heading";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "base" | "lg";
  color?: "charcoal" | "medium-gray";
}

const textStyles = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const textColors = {
  charcoal: "text-charcoal",
  "medium-gray": "text-medium-gray",
};

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = "base", color = "medium-gray", className = "", children, ...props }, ref) => (
    <p
      ref={ref}
      className={`leading-relaxed ${textStyles[size]} ${textColors[color]} ${className}`}
      {...props}
    >
      {children}
    </p>
  ),
);
Text.displayName = "Text";

interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "handwriting" | "sans";
}

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({ variant = "handwriting", className = "", children, ...props }, ref) => (
    <span
      ref={ref}
      className={`${
        variant === "handwriting" ? "font-handwriting" : "font-sans"
      } text-gold text-2xl ${className}`}
      {...props}
    >
      {children}
    </span>
  ),
);
Caption.displayName = "Caption";
