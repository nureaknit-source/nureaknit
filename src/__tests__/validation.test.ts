import { describe, it, expect } from "vitest";
import { validateContact, validateCoaching } from "@/lib/validation";

describe("validateContact", () => {
  it("passes with valid data", () => {
    const errors = validateContact({ name: "Budi", email: "budi@test.com", subject: "Halo", message: "Pesan uji coba" });
    expect(errors).toHaveLength(0);
  });

  it("fails on missing name", () => {
    const errors = validateContact({ name: "", email: "budi@test.com", subject: "Halo", message: "Pesan uji coba" });
    expect(errors).toContainEqual({ field: "name", message: "Nama harus diisi" });
  });

  it("fails on invalid email", () => {
    const errors = validateContact({ name: "Budi", email: "bukan-email", subject: "Halo", message: "Pesan uji coba" });
    expect(errors).toContainEqual({ field: "email", message: "Email tidak valid" });
  });

  it("fails on message too short", () => {
    const errors = validateContact({ name: "Budi", email: "budi@test.com", subject: "Halo", message: "pendek" });
    expect(errors).toContainEqual({ field: "message", message: "Pesan minimal 10 karakter" });
  });

  it("fails on missing subject", () => {
    const errors = validateContact({ name: "Budi", email: "budi@test.com", subject: "", message: "Pesan uji coba" });
    expect(errors).toContainEqual({ field: "subject", message: "Subjek harus diisi" });
  });
});

describe("validateCoaching", () => {
  it("passes with valid data", () => {
    const errors = validateCoaching({ name: "Budi", email: "budi@test.com", message: "Saya ingin kelas private" });
    expect(errors).toHaveLength(0);
  });

  it("fails on missing name", () => {
    const errors = validateCoaching({ name: "", email: "budi@test.com", message: "Saya ingin kelas private" });
    expect(errors).toContainEqual({ field: "name", message: "Nama harus diisi" });
  });

  it("fails on message too short", () => {
    const errors = validateCoaching({ name: "Budi", email: "budi@test.com", message: "cuma" });
    expect(errors).toContainEqual({ field: "message", message: "Pesan minimal 10 karakter" });
  });
});
