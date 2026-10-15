"use client";

import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFFDFB]">
            <div className="flex flex-col items-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-md border border-border bg-white">
                    <Image
                        src="/log.png"
                        alt="Unfold"
                        width={32}
                        height={32}
                        priority
                        className="h-8 w-8 object-contain"
                    />
                </div>

                <div className="mt-5 h-1 w-20 overflow-hidden rounded-full bg-border">
                    <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-brand" />
                </div>
            </div>
        </div>
    );
}