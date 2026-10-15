"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCreateAccount } from "@/hooks/auth/useAuth";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A10.99 10.99 0 0012 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"
    />
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  const createAccount = useCreateAccount();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface">
      {/* LEFT — FORM */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="mt-8 text-2xl sm:text-3xl font-bold tracking-tight text-main">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-muted leading-relaxed">
            Turn your product idea into something you can actually build.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();

              const formData = new FormData(event.currentTarget);

              const name = formData.get("fullName") as string;
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              createAccount.mutate(
                { name, email, password },
                {
                  onSuccess: () => {
                    router.replace("/dashboard");
                  },
                },
              );
            }}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-main"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                required
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-main"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@example.com"
                required
                className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-main"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                />

                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                  onClick={(event) => {
                    const input = event.currentTarget
                      .previousElementSibling as HTMLInputElement | null;

                    if (input) {
                      input.type =
                        input.type === "password" ? "text" : "password";
                    }
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a21.8 21.8 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a21.8 21.8 0 01-3.22 4.44M14.12 14.12a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={createAccount.isPending}
              className="w-full rounded-lg bg-brand hover:bg-brand/90 text-white cursor-pointer text-sm font-semibold py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createAccount.isPending
                ? "Creating account..."
                : "Create account"}
            </button>

            {createAccount.isError && (
              <p className="text-sm text-red-600" role="alert">
                {createAccount.error instanceof Error
                  ? createAccount.error.message
                  : "Could not create your account. Please try again."}
              </p>
            )}
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              or
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border cursor-pointer border-border bg-surface hover:bg-black/[0.02] text-sm font-semibold text-main py-3 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand hover:text-brand/80 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT — ILLUSTRATION */}
      <div className="hidden lg:flex relative bg-[#FAF8F5] items-center justify-center overflow-hidden">
        <Link
          href="/"
          className="absolute top-6 right-6 flex items-center gap-2 z-10"
        >
          <Image
            src="/log.png"
            alt="logo"
            width={42}
            height={42}
            className="object-contain"
          />

          <span className="font-bold text-xl text-[#181818] tracking-tight">
            UnFold
          </span>
        </Link>

        <div className="relative w-full max-w-md h-[420px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 420"
            fill="none"
          >
            <path
              d="M 200 40 L 200 100"
              stroke="#C65D3A"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              opacity="0.5"
            />

            <path
              d="M 200 100 L 110 150"
              stroke="#C65D3A"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              opacity="0.5"
            />

            <path
              d="M 200 100 L 290 150"
              stroke="#C65D3A"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              opacity="0.5"
            />

            <path
              d="M 200 100 L 200 210"
              stroke="#C65D3A"
              strokeWidth="1.5"
              opacity="0.5"
            />

            <path
              d="M 200 250 L 200 320"
              stroke="#C65D3A"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </svg>

          <div className="absolute top-[24px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-bold tracking-wider text-main">
              IDEA
            </span>
          </div>

          <div className="absolute top-[135px] left-[70px] flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full border border-brand" />
            <span className="text-[10px] font-bold tracking-wider text-brand">
              ACTORS
            </span>
          </div>

          <div className="absolute top-[135px] right-[55px] flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full border border-main" />
            <span className="text-[10px] font-bold tracking-wider text-main">
              WORKFLOWS
            </span>
          </div>

          <div className="absolute top-[195px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-surface pl-3 pr-4 py-1.5 rounded-lg border-l-2 border-brand shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-bold tracking-wider text-brand">
              GAPS
            </span>
          </div>

          <div className="absolute top-[280px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="text-[10px] font-bold tracking-wider text-muted">
              REFINE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}