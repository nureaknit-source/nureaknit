export interface ValidationError {
  field: string;
  message: string;
}

type Rule = { field: string; label: string; email?: boolean; minLength?: number };

function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function validate(data: Record<string, string>, rules: Rule[]): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const r of rules) {
    const v = (data[r.field] || "").trim();
    if (!v) {
      errors.push({ field: r.field, message: `${r.label} harus diisi` });
    } else if (r.email && !isEmail(v)) {
      errors.push({ field: r.field, message: `${r.label} tidak valid` });
    } else if (r.minLength && v.length < r.minLength) {
      errors.push({ field: r.field, message: `${r.label} minimal ${r.minLength} karakter` });
    }
  }
  return errors;
}

export function validateContact(data: Record<string, string>) {
  return validate(data, [
    { field: "name", label: "Nama" },
    { field: "email", label: "Email", email: true },
    { field: "subject", label: "Subjek" },
    { field: "message", label: "Pesan", minLength: 10 },
  ]);
}

export function validateCoaching(data: Record<string, string>) {
  return validate(data, [
    { field: "name", label: "Nama" },
    { field: "email", label: "Email", email: true },
    { field: "message", label: "Pesan", minLength: 10 },
  ]);
}
