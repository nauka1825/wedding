"use client";
import { useEffect, useState } from "react";
import { supabase, Wedding } from "@/lib/supabase";
import TemplateCard from "@/components/TemplateCard";

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
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <h1 className="font-[Playfair_Display,serif] text-2xl text-stone-800 font-light">
            Хурмын урилга бүртгэл
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ID эсвэл утасны дугаараар хайх..."
              className="flex-1 md:w-72 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 font-[Josefin_Sans,sans-serif]"
            />
            <button
              onClick={fetchWeddings}
              className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-[Josefin_Sans,sans-serif] hover:bg-stone-700 transition-colors"
            >
              ↻
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-stone-300 text-stone-600 rounded-lg text-sm font-[Josefin_Sans,sans-serif] hover:bg-stone-100 transition-colors"
            >
              + Нэмэх
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-stone-400 font-[Josefin_Sans,sans-serif]">
            Ачаалж байна...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-stone-400 font-[Josefin_Sans,sans-serif]">
            {search ? "Хайлтын үр дүн олдсонгүй" : "Бүртгэл байхгүй байна"}
          </div>
        ) : (
          <>
            <p className="text-stone-400 text-sm font-[Josefin_Sans,sans-serif] mb-6">
              Нийт {filtered.length} бүртгэл
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
