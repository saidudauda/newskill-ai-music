"use client";

import { useState } from "react";

const genres = ["Afrobeats", "Amapiano", "Afro-fusion", "Hip-hop", "R&B", "Gospel", "Pop", "Electronic", "Nupe fusion"];
const moods = ["Uplifting", "Chill", "Emotional", "Energetic", "Romantic", "Epic"];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [mode, setMode] = useState<"song" | "instrumental">("song");
  const [genre, setGenre] = useState("Afrobeats");
  const [mood, setMood] = useState("Uplifting");
  const [tab, setTab] = useState("Create");
  const [notice, setNotice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) { setNotice("Describe the sound you want first."); return; }
    setNotice("Studio interface is ready. Connect a music-generation API to generate real audio; no song has been generated yet.");
  }

  return <main className="shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark">N</span><span>NEWSKILL<span className="brand-light"> PRO</span><small>AI MUSIC STUDIO</small></span></a>
      <div className="workspace-label">WORKSPACE</div>
      {["Create", "My Library", "Explore"].map(item => <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => {setTab(item); setNotice(item === "Create" ? "" : item + " will be enabled as its data and services are connected.");}}><span className="nav-icon">{item === "Create" ? "✳" : item === "My Library" ? "♫" : "◈"}</span>{item}</button>)}
      <div className="side-spacer"/>
      <div className="credits-card"><div className="credits-top"><span>YOUR CREDITS</span><span className="credit-dot"/></div><strong>0 <small>credits</small></strong><p>Generation credits will appear when accounts and billing are connected.</p><button className="upgrade" onClick={() => setNotice("Subscription checkout is not connected yet.")}>View plans ↗</button></div>
      <div className="profile"><div className="avatar">N</div><div><strong>NEWSKILL PRO</strong><small>Creator workspace</small></div><span className="dots">···</span></div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="crumb">Studio <span>/</span> <b>{tab}</b></div><div className="top-actions"><span className="status"><i/> Studio preview</span><button className="avatar small-avatar">N</button></div></header>
      <div className="content">
        <div className="eyebrow"><span className="spark">✦</span> YOUR IDEAS. YOUR SOUND.</div>
        <h1>Make something<br/><em>that moves people.</em></h1>
        <p className="intro">Turn your imagination into music. Describe the sound, shape the vibe, and make it yours.</p>
        <div className="mode-switch"><button className={mode === "song" ? "selected" : ""} onClick={() => setMode("song")}>♫ <span>Song with vocals</span></button><button className={mode === "instrumental" ? "selected" : ""} onClick={() => setMode("instrumental")}>〰 <span>Instrumental</span></button></div>
        <form className="generator" onSubmit={submit}>
          <label htmlFor="prompt">DESCRIBE YOUR TRACK</label>
          <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A warm Afrobeats anthem with rich percussion, melodic guitar, uplifting energy and a catchy chorus..." maxLength={1200}/>
          <div className="field-meta"><span>Be specific about genre, instruments, vocals and mood.</span><span>{prompt.length}/1200</span></div>
          {mode === "song" && <><label htmlFor="lyrics" className="lyrics-label">LYRICS <span className="optional">OPTIONAL</span></label><textarea id="lyrics" className="lyrics" value={lyrics} onChange={e => setLyrics(e.target.value)} placeholder="Paste your lyrics here, or leave blank if your chosen provider supports lyric generation..." maxLength={5000}/></>}
          <div className="options-grid"><div><label htmlFor="genre">GENRE</label><select id="genre" value={genre} onChange={e => setGenre(e.target.value)}>{genres.map(g => <option key={g}>{g}</option>)}</select></div><div><label htmlFor="mood">MOOD</label><select id="mood" value={mood} onChange={e => setMood(e.target.value)}>{moods.map(m => <option key={m}>{m}</option>)}</select></div></div>
          <div className="form-footer"><span className="provider-note"><span>✧</span> AI music engine not connected</span><button className="generate" type="submit">Create track <span>✦</span></button></div>
          {notice && <div className="notice" role="status">{notice}</div>}
        </form>
        <div className="bottom-note"><span>✧</span><span><b>Made for creators.</b> Build a sound that belongs to you.</span><span className="bottom-right">NEWSKILL PRO © 2026</span></div>
      </div>
    </section>
  </main>;
}
