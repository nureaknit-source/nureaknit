export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isRequired(data.name)) {
    errors.push({ field: "name", message: "Nama harus diisi" });
  }
  if (!isRequired(data.email)) {
    errors.push({ field: "email", message: "Email harus diisi" });
  } else if (!isEmail(data.email)) {
    errors.push({ field: "email", message: "Email tidak valid" });
  }
  if (!isRequired(data.subject)) {
    errors.push({ field: "subject", message: "Subjek harus diisi" });
  }
  if (!isRequired(data.message)) {
    errors.push({ field: "message", message: "Pesan harus diisi" });
  } else if (!minLength(data.message, 10)) {
    errors.push({ field: "message", message: "Pesan minimal 10 karakter" });
  }

  return errors;
}

export function validateCoaching(data: {
  name: string;
  email: string;
  message: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!isRequired(data.name)) {
    errors.push({ field: "name", message: "Nama harus diisi" });
  }
  if (!isRequired(data.email)) {
    errors.push({ field: "email", message: "Email harus diisi" });
  } else if (!isEmail(data.email)) {
    errors.push({ field: "email", message: "Email tidak valid" });
  }
  if (!isRequired(data.message)) {
    errors.push({ field: "message", message: "Pesan harus diisi" });
  } else if (!minLength(data.message, 10)) {
    errors.push({ field: "message", message: "Pesan minimal 10 karakter" });
  }

  return errors;
}
