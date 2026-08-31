"use client";

import { useActionState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Input, Textarea } from "@/components/ui/input";
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
      showToast("Permintaan coaching berhasil terkirim! Kami akan segera menghubungimu.", "success");
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
        <Caption>Private Coaching</Caption>
        <Heading as="h1" className="mt-2">
          One-on-One Coaching
        </Heading>
        <Text className="mt-2">
          Ingin belajar merajut (<em>knitting</em> atau <em>crochet</em>) secara lebih intensif dan terarah? Yuk, ikuti sesi <em>offline coaching</em> privat bersama kami. Cukup isi form di bawah untuk mendiskusikan jadwal dan teknik yang ingin kamu pelajari.
        </Text>

        <form action={formAction} className="mt-8 space-y-4">
          <Input
            id="name"
            name="name"
            label="Nama"
            placeholder="Nama lengkap atau panggilanmu"
            required
            error={fieldError("name")}
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            required
            error={fieldError("email")}
          />
          <Textarea
            id="message"
            name="message"
            label="Pesan & Kebutuhan Belajar"
            rows={5}
            required
            placeholder="Ceritakan project impianmu atau teknik rajut yang ingin kamu pelajari..."
            error={fieldError("message")}
          />
          <Button type="submit" isLoading={pending}>
            Kirim Permintaan Coaching
          </Button>
        </form>
      </Container>
    </Section>
  );
}

