import { simulateRequest } from "./mock-transport";
import { ApiError } from "@/types/api";
import type { LoginInput, Session, SignupInput, User } from "@/types/user";

const MOCK_USER: User = {
  id: "user_1",
  name: "Aarnav Parashar",
  email: "aarnav.parashar@gmail.com",
  avatarUrl: null,
  role: "member",
  createdAt: new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString(),
  contributorEnabled: true,
  deployerEnabled: true,
};

/**
 * There is no backend yet, so there is no real session store. This resolves
 * with a demo session so the dashboard can be walked end to end; it still
 * has the shape and failure mode (`unauthorized`) a real session check would
 * have, so swapping in a real check later touches only this function.
 */
export async function getSession(): Promise<Session> {
  return simulateRequest(
    { user: MOCK_USER, expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() },
    { latencyMs: [120, 260] },
  );
}

export async function login(input: LoginInput): Promise<Session> {
  if (!input.email.includes("@")) {
    throw new ApiError({
      code: "validation_error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: { email: "Enter a valid email address." },
    });
  }
  if (input.password.length < 8) {
    throw new ApiError({
      code: "validation_error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: { password: "Password must be at least 8 characters." },
    });
  }
  return simulateRequest(
    { user: { ...MOCK_USER, email: input.email }, expiresAt: new Date(Date.now() + 3600 * 1000).toISOString() },
    { latencyMs: [400, 800] },
  );
}

export async function signup(input: SignupInput): Promise<Session> {
  if (input.password.length < 8) {
    throw new ApiError({
      code: "validation_error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: { password: "Password must be at least 8 characters." },
    });
  }
  return simulateRequest(
    {
      user: { ...MOCK_USER, name: input.name, email: input.email },
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    },
    { latencyMs: [450, 850] },
  );
}

export async function logout(): Promise<{ success: true }> {
  return simulateRequest({ success: true }, { latencyMs: [120, 220] });
}
