"use client";

import { useActionState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading, Text, Caption } from "@/components/ui/typography";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitContactAction } from "@/actions/contact";
import { showToast } from "@/components/ui/toast";
import type { ValidationError } from "@/lib/validation";

interface FormState {
  success: boolean;
  errors?: ValidationError[];
}

const initialState: FormState = { success: false };

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContactAction, initialState);

  useEffect(() => {
    if (state.success) {
      showToast("Pesanmu berhasil terkirim! Terima kasih sudah menghubungi kami.", "success");
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
        <Caption>Contact Us</Caption>
        <Heading as="h1" className="mt-2">
          Let&apos;s Get in Touch!
        </Heading>
        <Text className="mt-2">
          Punya pertanyaan seputar pola, pesanan, atau ingin mengajak kerja sama seru? <em>Feel free to drop a message.</em> Kami akan dengan senang hati menyapamu kembali!
        </Text>

        <form action={formAction} className="mt-8 space-y-4">
          <Input
            id="name"
            name="name"
            label="Nama"
            placeholder="Nama kamu"
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
          <Input
            id="subject"
            name="subject"
            label="Subjek"
            placeholder="Topik yang ingin kamu tanyakan atau diskusikan"
            required
            error={fieldError("subject")}
          />
          <Textarea
            id="message"
            name="message"
            label="Pesan"
            rows={5}
            required
            placeholder="Tulis pesanmu di sini..."
            error={fieldError("message")}
          />
          <Button type="submit" isLoading={pending}>
            Kirim Pesan
          </Button>
        </form>
      </Container>
    </Section>
  );
}

