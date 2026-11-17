"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { inputClass, primaryButtonClass } from "@/components/admin/styles";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-8 space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--text-muted)]">Username</span>
        <input
          name="username"
          defaultValue={state.username}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-[var(--text-muted)]">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-[#a5432f]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButtonClass} w-full`}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
