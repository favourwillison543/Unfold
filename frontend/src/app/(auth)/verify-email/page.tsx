"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { FiArrowRight, FiCheck, FiMail } from "react-icons/fi";

import { useVerifyEmail } from "@/hooks/auth/useAuth";

const OTP_LENGTH = 6;
const VERIFICATION_EMAIL_KEY = "verificationEmail";

export default function VerifyEmailPage() {
  const router = useRouter();

  const verifyEmail = useVerifyEmail();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem(
      VERIFICATION_EMAIL_KEY
    );

    if (storedEmail) {
      setEmail(storedEmail);
    }

    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (
    index: number,
    value: string
  ) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(-1);

    const nextOtp = [...otp];

    nextOtp[index] = digit;

    setOtp(nextOtp);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    const nextOtp = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    setError("");

    const nextIndex = Math.min(
      pasted.length,
      OTP_LENGTH - 1
    );

    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (!email) {
      setError(
        "Your verification session has expired. Please return to signup."
      );
      return;
    }

    setError("");

    try {
      await verifyEmail.mutateAsync({
        email,
        otp: code,
      });

      // The backend has successfully verified the email.
      // Remove the temporary email immediately.
      sessionStorage.removeItem(
        VERIFICATION_EMAIL_KEY
      );

      setIsSuccess(true);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          "The verification code is invalid or expired."
      );
    }
  };

  const handleContinue = () => {
    router.replace("/dashboard");
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-[#FFFDFB] px-6 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
          <div className="w-full text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C65D3A]/10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C65D3A] text-white">
                <FiCheck size={22} />
              </div>
            </div>

            <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#171717]">
              Email verified
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-[#71717A]">
              Your Unfold account is ready. You can now start
              turning your product ideas into clear product
              logic.
            </p>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#C65D3A] px-6 text-sm font-medium text-white transition hover:bg-[#B45132]"
            >
              Continue to Unfold
              <FiArrowRight size={17} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDFB] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C65D3A] text-white">
              <FiMail size={21} />
            </div>

            <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#171717]">
              Verify your email
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-6 text-[#71717A]">
              We sent a 6-digit verification code to
            </p>

            <p className="mt-1 break-all text-[15px] font-medium text-[#171717]">
              {email || "your email address"}
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="rounded-2xl border border-[#E7E5E4] bg-white p-6 shadow-[0_8px_30px_rgba(23,23,23,0.04)]"
          >
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={
                    index === 0 ? "one-time-code" : "off"
                  }
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  onPaste={handlePaste}
                  className="h-12 w-11 rounded-xl border border-[#D6D3D1] bg-[#FFFDFB] text-center text-lg font-semibold text-[#171717] outline-none transition placeholder:text-[#A8A29E] focus:border-[#C65D3A] focus:ring-2 focus:ring-[#C65D3A]/10 sm:h-14 sm:w-12"
                  aria-label={`Verification code digit ${
                    index + 1
                  }`}
                />
              ))}
            </div>

            {error && (
              <p className="mt-4 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={verifyEmail.isPending}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C65D3A] text-sm font-medium text-white transition hover:bg-[#B45132] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyEmail.isPending
                ? "Verifying..."
                : "Verify email"}
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-[#A8A29E]">
              The code expires in 10 minutes.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}