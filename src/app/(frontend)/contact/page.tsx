"use client";

import { useActionState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitContactAction } from "@/actions/contact";
import { showToast } from "@/components/ui/toast";
import type { ValidationError } from "@/lib/validation";

interface FormState {
  success: boolean;
  errors?: ValidationError[] | { field: string; message: string }[];
}

const initialState: FormState = { success: false };

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  useEffect(() => {
    if (state.success) {
      showToast("Pesan berhasil dikirim!", "success");
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
        <Caption>Contact</Caption>
        <Heading as="h1" className="mt-2">
          Get in Touch
        </Heading>
        <Text className="mt-2">
          Punya pertanyaan, saran, atau ingin bekerja sama? Silakan kirim pesan
          melalui form di bawah.
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
            <Input
              id="subject"
              name="subject"
              label="Subjek"
              placeholder="Apa yang ingin kamu sampaikan?"
              required
              aria-invalid={!!fieldError("subject")}
            />
            {fieldError("subject") && (
              <p className="mt-1 text-xs text-error">{fieldError("subject")}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-charcoal"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Tulis pesan kamu di sini..."
              className="w-full rounded-lg border border-light-gray px-3 py-2 text-sm text-charcoal placeholder:text-medium-gray focus:border-sage focus:ring-2 focus:ring-sage/10"
              aria-invalid={!!fieldError("message")}
            />
            {fieldError("message") && (
              <p className="mt-1 text-xs text-error">{fieldError("message")}</p>
            )}
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Mengirim..." : "Kirim Pesan"}
          </Button>
        </form>
      </Container>
    </Section>
  );
}
