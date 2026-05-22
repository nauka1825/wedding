import { supabase } from "@/lib/supabase";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";
import Template4 from "@/components/templates/Template4";
import Template5 from "@/components/templates/Template5";
import Template6 from "@/components/templates/Template6";
import Template7 from "@/components/templates/Template7";
import Template8 from "@/components/templates/Template8";

export default async function WeddingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: wedding, error } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !wedding) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-400 font-[Josefin_Sans,sans-serif] text-sm">
          Бүртгэл олдсонгүй
        </p>
        <a
          href="/weddings"
          className="text-xs border border-stone-300 px-4 py-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors font-[Josefin_Sans,sans-serif]"
        >
          ← Жагсаалт руу буцах
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      {wedding.template === "luxury" && <Template2 wedding={wedding} />}
      {wedding.template === "bohemian" && <Template3 wedding={wedding} />}
      {wedding.template === "azure" && <Template4 wedding={wedding} />}
      {wedding.template === "sage" && <Template5 wedding={wedding} />}
      {wedding.template === "blush" && <Template6 wedding={wedding} />}
      {wedding.template === "midnight" && <Template7 wedding={wedding} />}
      {wedding.template === "terracotta" && <Template8 wedding={wedding} />}
      {(wedding.template === "romantic" || !wedding.template) && (
        <Template1 wedding={wedding} />
      )}
    </div>
  );
}
