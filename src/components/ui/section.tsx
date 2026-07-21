import { HTMLAttributes, forwardRef } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
}

const spacings = {
  sm: "py-12",
  md: "py-16",
  lg: "py-24",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ spacing = "md", className = "", children, ...props }, ref) => (
    <section
      ref={ref}
      className={`${spacings[spacing]} ${className}`}
      {...props}
    >
      {children}
    </section>
  ),
);
Section.displayName = "Section";
