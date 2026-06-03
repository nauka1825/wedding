"use client";

import WeddingFormWomen from "@/components/WeddingFormWomen";

export default function ToiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-100 to-blue-300">
      <div className="relative z-10">
        <div className="mx-4 mt-5 mb-6 rounded-3xl overflow-hidden relative bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 p-6 shadow-xl">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-2 right-5 text-6xl rotate-12">✨</div>
            <div className="absolute bottom-2 left-4 text-5xl -rotate-12">
              ❋
            </div>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
              <span className="h-2 w-2 rounded-full bg-sky-200"></span>
              <span className="text-sky-100 text-xs tracking-wide uppercase">
                Шақыру жасау
              </span>
            </div>

            <h1 className="font-playfair text-white text-2xl md:text-3xl font-medium">
              Қыз ұзату кешіне арналған шақыру жасау
            </h1>
          </div>
        </div>

        <WeddingFormWomen onSuccess={() => {}} />
      </div>
    </main>
  );
}
