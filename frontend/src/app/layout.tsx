import type { Metadata } from "next";

import { Instrument_Sans } from "next/font/google";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";

import { Toaster } from "sonner";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unfold",
  description:
    "Turn rough product ideas into clear product logic.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}

          <Toaster
            position="top-right"
            expand={false}
            closeButton
            toastOptions={{
              duration: 4000,

              classNames: {
                toast:
                  "group !border-[#E7E5E4] !bg-[#FFFDFB] !text-[#171717] !shadow-[0_8px_30px_rgba(23,23,23,0.08)] !rounded-xl",

                title:
                  "!text-sm !font-semibold !text-[#171717]",

                description:
                  "!text-sm !text-[#71717A]",

                actionButton:
                  "!bg-[#C65D3A] !text-white hover:!bg-[#B45132]",

                cancelButton:
                  "!bg-[#F5F5F4] !text-[#171717] hover:!bg-[#E7E5E4]",

                closeButton:
                  "!border-[#E7E5E4] !bg-transparent !text-[#A8A29E] hover:!bg-[#F5F5F4] hover:!text-[#171717]",

                success:
                  "!border-[#C65D3A]/25",

                error:
                  "!border-[#C65D3A]/25",

                warning:
                  "!border-[#C65D3A]/25",

                info:
                  "!border-[#C65D3A]/25",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}