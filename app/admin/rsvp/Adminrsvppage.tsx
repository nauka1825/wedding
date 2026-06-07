"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

// ── Types ──────────────────────────────────────────────
type Wedding = {
  id: string;
  male_name: string;
  female_name: string;
  wedding_date: string | null;
  phone: string | null;
};

type RSVP = {
  id: string;
  wedding_id: string;
  name: string;
  status: "attending" | "not_attending" | "maybe";
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  attending: "✅ Келеді",
  not_attending: "❌ Келмейді",
  maybe: "🤔 Мүмкін",
};

const STATUS_COLOR: Record<string, string> = {
  attending: "#16a34a",
  not_attending: "#dc2626",
  maybe: "#d97706",
};

// ── Main Component ─────────────────────────────────────
export default function AdminRSVPPage() {
  const [query, setQuery] = useState("");
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [rsvpList, setRsvpList] = useState<RSVP[]>([]);
  const [loadingRsvp, setLoadingRsvp] = useState(false);

  // ── Search weddings by phone or id ──
  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setSearchError("");
    setWeddings([]);
    setSelectedWedding(null);
    setRsvpList([]);

    // Try UUID match first, then phone
    const isUUID = /^[0-9a-f-]{36}$/i.test(q);
    let data: Wedding[] | null = null;
    let err: unknown = null;

    if (isUUID) {
      const res = await supabase
        .from("weddings")
        .select("id, male_name, female_name, wedding_date, phone")
        .eq("id", q)
        .limit(10);
      data = res.data;
      err = res.error;
    } else {
      // phone search — partial match
      const res = await supabase
        .from("weddings")
        .select("id, male_name, female_name, wedding_date, phone")
        .ilike("phone", `%${q}%`)
        .limit(10);
      data = res.data;
      err = res.error;
    }

    if (err || !data) {
      setSearchError("Қате орын алды. Қайталап көріңіз.");
    } else if (data.length === 0) {
      setSearchError("Ешнәрсе табылмады.");
    } else {
      setWeddings(data);
    }
    setSearching(false);
  }

  // ── Load RSVP for selected wedding ──
  async function loadRSVP(wedding: Wedding) {
    setSelectedWedding(wedding);
    setLoadingRsvp(true);
    setRsvpList([]);
    const { data } = await supabase
      .from("rsvp")
      .select("*")
      .eq("wedding_id", wedding.id)
      .order("created_at", { ascending: true });
    if (data) setRsvpList(data);
    setLoadingRsvp(false);
  }

  // ── Export to Excel ──
  function exportExcel() {
    if (!selectedWedding || rsvpList.length === 0) return;

    const rows = rsvpList.map((r, i) => ({
      "№": i + 1,
      "Аты-жөні": r.name,
      Жауабы: STATUS_LABEL[r.status] ?? r.status,
      "Жіберілген уақыты": new Date(r.created_at).toLocaleString("kk-KZ"),
    }));

    const summary = [
      { "": "", " ": "" },
      { "": "Барлығы:", " ": rsvpList.length },
      {
        "": "Келеді:",
        " ": rsvpList.filter((r) => r.status === "attending").length,
      },
      {
        "": "Мүмкін:",
        " ": rsvpList.filter((r) => r.status === "maybe").length,
      },
      {
        "": "Келмейді:",
        " ": rsvpList.filter((r) => r.status === "not_attending").length,
      },
    ];

    const wb = XLSX.utils.book_new();

    // Main sheet
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 5 }, { wch: 28 }, { wch: 18 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(wb, ws, "RSVP");

    // Summary sheet
    const ws2 = XLSX.utils.json_to_sheet(summary);
    ws2["!cols"] = [{ wch: 16 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Қорытынды");

    const filename = `RSVP_${selectedWedding.male_name}_${selectedWedding.female_name}_${new Date().toLocaleDateString("kk-KZ").replace(/\//g, "-")}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  // ── Stats ──
  const attending = rsvpList.filter((r) => r.status === "attending").length;
  const maybe = rsvpList.filter((r) => r.status === "maybe").length;
  const notAttending = rsvpList.filter(
    (r) => r.status === "not_attending",
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#FDF0F5 0%,#F5F0FD 100%)",
        fontFamily: "'Cinzel', serif",
        padding: "32px 16px 80px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        button:active { transform: scale(0.97); }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* ── Title ── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💍</div>
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#7B3F5E",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Admin
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#C4A0B0",
              fontSize: 15,
              marginTop: 6,
            }}
          >
            Той қонақтарын басқару
          </p>
        </div>

        {/* ── Search box ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "20px",
            border: "1px solid rgba(196,160,176,0.25)",
            boxShadow: "0 4px 20px rgba(196,160,176,0.12)",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#C4A0B0",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Телефон немесе ID бойынша іздеу
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="+99119911 немесе id..."
              style={{
                flex: 1,
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 14,
                fontFamily: "'Cinzel', serif",
                color: "#3d2030",
                border: "1.5px solid rgba(196,160,176,0.35)",
                background: "#FDF6F9",
              }}
            />
            <button
              onClick={handleSearch}
              disabled={searching || !query.trim()}
              style={{
                borderRadius: 12,
                padding: "12px 20px",
                background: "linear-gradient(135deg,#7B3F5E,#C4A0B0)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: searching || !query.trim() ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {searching ? (
                <svg
                  className="spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
              Іздеу
            </button>
          </div>

          {searchError && (
            <p
              className="fade-in"
              style={{
                marginTop: 10,
                color: "#9B6B7E",
                fontSize: 13,
                textAlign: "center",
                fontFamily: "'Cormorant Garamond',serif",
                fontStyle: "italic",
              }}
            >
              {searchError}
            </p>
          )}
        </div>

        {/* ── Wedding results ── */}
        {weddings.length > 0 && (
          <div className="fade-in" style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#C4A0B0",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Табылған тойлар
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {weddings.map((w) => (
                <button
                  key={w.id}
                  onClick={() => loadRSVP(w)}
                  style={{
                    borderRadius: 16,
                    padding: "14px 18px",
                    background:
                      selectedWedding?.id === w.id
                        ? "rgba(123,63,94,0.08)"
                        : "rgba(255,255,255,0.95)",
                    border:
                      selectedWedding?.id === w.id
                        ? "2px solid #7B3F5E"
                        : "1px solid rgba(196,160,176,0.25)",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 10px rgba(196,160,176,0.1)",
                    transition: "all 0.2s",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#7B3F5E",
                        margin: 0,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {w.male_name} & {w.female_name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontStyle: "italic",
                        fontSize: 13,
                        color: "#C4A0B0",
                        margin: "3px 0 0",
                      }}
                    >
                      {w.phone ?? "—"} · {w.wedding_date?.slice(0, 10) ?? "—"}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C4A0B0"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── RSVP list ── */}
        {selectedWedding && (
          <div className="fade-in">
            {/* Header */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: 20,
                padding: "20px",
                border: "1px solid rgba(196,160,176,0.25)",
                boxShadow: "0 4px 20px rgba(196,160,176,0.12)",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#7B3F5E",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}
                  >
                    {selectedWedding.male_name} & {selectedWedding.female_name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontStyle: "italic",
                      fontSize: 13,
                      color: "#C4A0B0",
                      margin: "4px 0 0",
                    }}
                  >
                    {rsvpList.length} жауап
                  </p>
                </div>

                {/* Export button */}
                <button
                  onClick={exportExcel}
                  disabled={rsvpList.length === 0}
                  style={{
                    borderRadius: 12,
                    padding: "10px 18px",
                    background:
                      rsvpList.length === 0
                        ? "#E5D5DF"
                        : "linear-gradient(135deg,#16a34a,#15803d)",
                    color: "#fff",
                    border: "none",
                    cursor: rsvpList.length === 0 ? "not-allowed" : "pointer",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: "'Cinzel',serif",
                    boxShadow:
                      rsvpList.length > 0
                        ? "0 2px 12px rgba(22,163,74,0.3)"
                        : "none",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Excel
                </button>
              </div>

              {/* Stats */}
              {rsvpList.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  {[
                    {
                      label: "Келеді",
                      count: attending,
                      color: "#16a34a",
                      emoji: "✅",
                    },
                    {
                      label: "Мүмкін",
                      count: maybe,
                      color: "#d97706",
                      emoji: "🤔",
                    },
                    {
                      label: "Келмейді",
                      count: notAttending,
                      color: "#dc2626",
                      emoji: "❌",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        borderRadius: 12,
                        padding: "10px 8px",
                        background: `${s.color}10`,
                        border: `1px solid ${s.color}25`,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 18 }}>{s.emoji}</div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: s.color,
                          lineHeight: 1.2,
                          marginTop: 2,
                        }}
                      >
                        {s.count}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: s.color,
                          opacity: 0.75,
                          marginTop: 2,
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Loading */}
            {loadingRsvp && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <svg
                  className="spin"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C4A0B0"
                  strokeWidth="2"
                  style={{ margin: "0 auto" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            )}

            {/* Empty */}
            {!loadingRsvp && rsvpList.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "#C4A0B0",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontStyle: "italic",
                  fontSize: 16,
                }}
              >
                Әлі жауап жоқ.
              </div>
            )}

            {/* RSVP rows */}
            {!loadingRsvp && rsvpList.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rsvpList.map((r, i) => (
                  <div
                    key={r.id}
                    className="fade-in"
                    style={{
                      borderRadius: 14,
                      padding: "13px 16px",
                      background: "rgba(255,255,255,0.97)",
                      border: `1px solid ${STATUS_COLOR[r.status]}20`,
                      boxShadow: "0 2px 8px rgba(196,160,176,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {/* Index */}
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: "rgba(196,160,176,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          color: "#9B6B7E",
                          flexShrink: 0,
                          fontWeight: 600,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#3d2030",
                            margin: 0,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {r.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontStyle: "italic",
                            fontSize: 12,
                            color: "#C4A0B0",
                            margin: "2px 0 0",
                          }}
                        >
                          {new Date(r.created_at).toLocaleString("kk-KZ", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        borderRadius: 10,
                        padding: "5px 12px",
                        background: `${STATUS_COLOR[r.status]}12`,
                        border: `1px solid ${STATUS_COLOR[r.status]}30`,
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        color: STATUS_COLOR[r.status],
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {STATUS_LABEL[r.status]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
