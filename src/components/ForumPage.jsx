import React, { useState } from "react";

export default function ForumPage() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: "Quel objectif privilégier pour du portrait en studio ?",
      author: "Marc Vancans",
      category: "Matériel & Technique",
      replies: 3
    }
  ]);

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>💬 Forum Communautaire Boke One</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Échangez entre créatifs, astuces et conseils.</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {topics.map((t) => (
          <div key={t.id} style={{ background: "#0f172a", border: "1px solid #1e293b", padding: "15px", borderRadius: "8px" }}>
            <span style={{ color: "#38bdf8", fontSize: "12px" }}>{t.category}</span>
            <h3 style={{ margin: "5px 0", fontSize: "16px" }}>{t.title}</h3>
            <span style={{ color: "#64748b", fontSize: "12px" }}>Par {t.author} • {t.replies} réponses</span>
          </div>
        ))}
      </div>
    </div>
  );
}