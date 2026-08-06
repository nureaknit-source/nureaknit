"use client";

import { useActionState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitCoachingAction } from "@/actions/coaching";
import { showToast } from "@/components/ui/toast";
import type { ValidationError } from "@/lib/validation";

interface FormState {
  success: boolean;
  errors?: ValidationError[];
}

const initialState: FormState = { success: false };

export default function CoachingPage() {
  const [state, formAction, pending] = useActionState(submitCoachingAction, initialState);

  useEffect(() => {
    if (state.success) {
      showToast("Permintaan coaching berhasil terkirim!", "success");
    } else if (state.errors?.length) {
      const formError = state.errors.find((e) => e.field === "form");
      if (formError) showToast(formError.message, "error");
    }
  }, [state]);

  const fieldError = (name: string) =>
    state.errors?.find((e) => e.field === name)?.message;

  return (
    <Section>
      <Container size="sm">
        <Caption>Coaching</Caption>
        <Heading as="h1" className="mt-2">
          One-on-One Coaching
        </Heading>
        <Text className="mt-2">
          Tertarik untuk belajar menenun atau mengikat secara pribadi? Kirimkan
          permintaan coaching offline dengan mengisi form di bawah.
        </Text>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <Input
              id="name"
              name="name"
              label="Nama"
              placeholder="Nama kamu"
              required
              aria-invalid={!!fieldError("name")}
            />
            {fieldError("name") && (
              <p className="mt-1 text-xs text-error">{fieldError("name")}</p>
            )}
          </div>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="email@example.com"
              required
              aria-invalid={!!fieldError("email")}
            />
            {fieldError("email") && (
              <p className="mt-1 text-xs text-error">{fieldError("email")}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-fg-default"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Ceritakan kebutuhan coaching kamu..."
              className="w-full rounded-lg border border-border bg-bg-surface-muted px-4 py-2 text-sm text-fg-default placeholder:text-fg-muted focus:border-primary focus:ring-2 focus:ring-primary-subtle"
              aria-invalid={!!fieldError("message")}
            />
            {fieldError("message") && (
              <p className="mt-1 text-xs text-error">{fieldError("message")}</p>
            )}
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Mengirim..." : "Kirim Permintaan"}
          </Button>
        </form>
      </Container>
    </Section>
  );
}
