import React from "react";
import { Gift, Sparkles, Star } from "lucide-react";

export default function HeaderSection() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-6 shadow-xl shadow-orange-950/20 sm:p-8 border border-orange-400/40">
      {/* Decorative background glow elements */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-amber-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 right-36 h-44 w-44 rounded-full bg-orange-300/30 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-orange-700/40 blur-xl" />

      <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white shadow-inner backdrop-blur-md sm:h-16 sm:w-16">
            <Gift size={30} strokeWidth={1.8} className="text-white" />
          </div>

          {/* Heading */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-orange-200/40 bg-orange-950/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-100 backdrop-blur-md">
                E-Store
              </span>
              <Sparkles size={15} className="text-amber-200" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Rewards Store
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-orange-100/90 sm:text-base">
              Turn your points into rewards. Explore available items and redeem
              something special!
            </p>
          </div>
        </div>

        {/* Decorative reward badge */}
        <div className="hidden items-center gap-3 rounded-xl border border-orange-200/30 bg-white/95 px-4 py-3 backdrop-blur-md md:flex shadow-lg shadow-orange-950/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm">
            <Star
              size={20}
              className="fill-white text-white stroke-1"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-600">Earn. Save. Redeem.</p>
            <p className="text-xs text-orange-950/70">
              Your rewards await
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}