"use client";
import { useEffect, useState } from "react";
import { supabase, Wedding } from "@/lib/supabase";
import TemplateCard from "@/components/TemplateCard";
import Link from "next/link";

export default function WeddingsPage() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [filtered, setFiltered] = useState<Wedding[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeddings();
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(weddings);
      return;
    }
    setFiltered(
      weddings.filter(
        (w) =>
          w.id.toLowerCase().includes(q) ||
          (w.phone || "").toLowerCase().includes(q) ||
          w.male_name.toLowerCase().includes(q) ||
          w.female_name.toLowerCase().includes(q),
      ),
    );
  }, [search, weddings]);

  async function fetchWeddings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("weddings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setWeddings(data);
      setFiltered(data);
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #FDF0F5 0%, #FDF6F0 50%, #F0F5FD 100%)",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-rose-100/50 px-4 py-3.5">
        <div className="flex items-center justify-between mb-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-rose-300">✿</span>
            <span className="font-playfair text-stone-700 text-base font-light">
              Хурмын бүртгэл
            </span>
          </Link>
          <Link
            href="/"
            className="text-[11px] font-josefin tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors"
          >
            + Нэмэх
          </Link>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ID эсвэл утасны дугаараар хайх..."
          className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-300 bg-white/80 placeholder:text-stone-300 font-josefin"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-5 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-rose-200 border-t-rose-400 rounded-full animate-spin" />
            <p className="text-stone-400 font-josefin text-xs tracking-widest uppercase">
              Ачаалж байна...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl opacity-30">💍</span>
            <p className="text-stone-400 font-josefin text-xs tracking-widest uppercase text-center">
              {search ? "Хайлтын үр дүн олдсонгүй" : "Бүртгэл байхгүй байна"}
            </p>
            {!search && (
              <Link
                href="/"
                className="mt-2 px-5 py-2.5 bg-stone-800 text-white rounded-xl font-josefin text-xs tracking-widest uppercase hover:bg-stone-700 transition-colors"
              >
                + Шинэ бүртгэл
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-stone-400 text-xs font-josefin tracking-wide">
                Нийт{" "}
                <span className="text-stone-600 font-semibold">
                  {filtered.length}
                </span>{" "}
                бүртгэл
              </p>
              <button
                onClick={fetchWeddings}
                className="text-xs font-josefin tracking-wide text-stone-400 hover:text-stone-600 transition-colors"
              >
                ↻ Шинэчлэх
              </button>
            </div>
            <div className="space-y-4">
              {filtered.map((w) => (
                <TemplateCard key={w.id} wedding={w} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
