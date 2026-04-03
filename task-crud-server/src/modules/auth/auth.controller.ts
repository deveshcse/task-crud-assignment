import { type Request, type Response, type NextFunction } from "express";
import * as authService from "./auth.service.js";
import { sendSuccess } from "../../utils/api-response.js";
import {
  type RegisterInput,
  type LoginInput,
  type RefreshInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "./auth.schema.js";

// ── register ──────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as RegisterInput;
    const result = await authService.register(input);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

// ── login ─────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as LoginInput;
    const result = await authService.login(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

// ── refresh ───────────────────────────────────────────────────────────────────
// POST /api/v1/auth/refresh

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body as RefreshInput;
    const result = await authService.refresh(refreshToken);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

// ── logout ────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/logout  (protected)

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await authService.logout(req.user.userId);
    sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

// ── forgotPassword ───────────────────────────────────────────────────────────
// POST /api/v1/auth/forgot-password

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as ForgotPasswordInput;
    await authService.forgotPassword(input);
    sendSuccess(res, {
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

// ── resetPassword ────────────────────────────────────────────────────────────
// POST /api/v1/auth/reset-password

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as ResetPasswordInput;
    await authService.resetPassword(input);
    sendSuccess(res, { message: "Password has been reset successfully." });
  } catch (error) {
    next(error);
  }
}
