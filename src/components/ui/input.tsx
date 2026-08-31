import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-fg-default"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={`w-full rounded-full border bg-bg-surface-muted px-4 py-2.5 text-sm text-fg-default placeholder:text-fg-muted transition focus:outline-none focus:ring-2 disabled:opacity-50 ${
          error
            ? "border-error focus:border-error focus:ring-error-subtle"
            : "border-border focus:border-primary focus:ring-primary-subtle"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-fg-muted">{helperText}</p>
      )}
    </div>
  ),
);
Input.displayName = "Input";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, rows = 4, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-fg-default"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-bg-surface-muted px-4 py-2.5 text-sm text-fg-default placeholder:text-fg-muted transition focus:outline-none focus:ring-2 disabled:opacity-50 ${
          error
            ? "border-error focus:border-error focus:ring-error-subtle"
            : "border-border focus:border-primary focus:ring-primary-subtle"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-fg-muted">{helperText}</p>
      )}
    </div>
  ),
);
Textarea.displayName = "Textarea";

