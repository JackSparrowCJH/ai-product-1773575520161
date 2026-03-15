"use client";

import { useEffect, useState } from "react";

interface RankItem {
  rank: number;
  openid: string;
  nickname: string;
  avatar: string;
  merit: number;
  is_self: boolean;
}

interface RankData {
  ok: boolean;
  ranking?: RankItem[];
  total?: number;
  has_friends?: boolean;
  message?: string | null;
  error?: string;
  code?: string;
}

export default function RankPage() {
  const [openid, setOpenid] = useState("");
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRank = async (id?: string) => {
    setLoading(true);
    const qid = id ?? openid;
    const url = qid ? `/api/rank?openid=${encodeURIComponent(qid)}` : `/api/rank`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <main style={{ padding: "1.5rem", fontFamily: "system-ui, sans-serif", maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.4rem" }}>🏆 好友功德排行榜</h1>

      <div style={{ margin: "1rem 0", display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="输入你的 openid"
          value={openid}
          onChange={(e) => setOpenid(e.target.value)}
          style={{ flex: 1, padding: "0.5rem", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={() => fetchRank()}
          style={{ padding: "0.5rem 1rem", borderRadius: 6, background: "#D4A017", color: "#fff", border: "none", cursor: "pointer" }}
        >
          查看排行
        </button>
      </div>

      {loading && <p>加载中...</p>}

      {data && !data.ok && (
        <div style={{ padding: "1.5rem", background: "#fff3cd", borderRadius: 8, textAlign: "center", marginTop: "1rem" }}>
          <p style={{ fontSize: "2rem" }}>🔒</p>
          <p>{data.error}</p>
        </div>
      )}

      {data && data.ok && data.message && (
        <div style={{ padding: "1.5rem", background: "#e8f4f8", borderRadius: 8, textAlign: "center", marginTop: "1rem" }}>
          <p style={{ fontSize: "2rem" }}>📭</p>
          <p>{data.message}</p>
        </div>
      )}

      {data && data.ok && data.ranking && data.ranking.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          {data.ranking.map((item) => (
            <div
              key={item.openid}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.75rem",
                marginBottom: 6,
                background: item.is_self ? "#fff8e1" : "#f9f9f9",
                borderRadius: 8,
                border: item.is_self ? "2px solid #D4A017" : "1px solid #eee",
              }}
            >
              <span style={{ width: 32, fontWeight: "bold", color: item.rank <= 3 ? "#D4A017" : "#999" }}>
                {item.rank <= 3 ? ["🥇", "🥈", "🥉"][item.rank - 1] : `#${item.rank}`}
              </span>
              <span style={{ flex: 1 }}>
                {item.nickname}
                {item.is_self && <span style={{ fontSize: "0.8rem", color: "#999" }}> (我)</span>}
              </span>
              <span style={{ fontWeight: "bold", color: "#D4A017" }}>
                功德 {item.merit}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
