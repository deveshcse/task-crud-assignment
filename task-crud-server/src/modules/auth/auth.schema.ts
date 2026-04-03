import { z } from "zod";

// ── Register ──────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(72, "Password must be at most 72 characters"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];

// ── Login ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];

// ── Refresh ───────────────────────────────────────────────────────────────────

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export type RefreshInput = z.infer<typeof refreshSchema>["body"];
