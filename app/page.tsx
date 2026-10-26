"use client";

import { useState } from "react";

const genres = ["Afrobeats", "Amapiano", "Afro-fusion", "Hip-hop instrumental", "R&B instrumental", "Gospel instrumental", "Pop", "Electronic", "Nupe fusion"];
const moods = ["Uplifting", "Chill", "Emotional", "Energetic", "Romantic", "Epic"];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Afrobeats");
  const [mood, setMood] = useState("Uplifting");
  const [duration, setDuration] = useState("30");
  const [tab, setTab] = useState("Create");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioName, setAudioName] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) { setNotice("Describe the sound you want first."); return; }
    setBusy(true);
    setNotice("Preparing your instrumental…");
    try {
      const response = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), genre, mood, duration: Number(duration) }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Music generation is not available yet.");
      }
      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(nextUrl);
      setAudioName(`newskill-pro-${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.mp3`);
      setNotice("Your instrumental is ready. Listen below or download the MP3.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong. No track was created.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="shell">
    <aside className="sidebar">
      <a className="brand" href="#"><span className="brand-mark">N</span><span>NEWSKILL<span className="brand-light"> PRO</span><small>AI MUSIC STUDIO</small></span></a>
      <div className="workspace-label">WORKSPACE</div>
      {["Create", "My Library", "Explore"].map(item => <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => {setTab(item); setNotice(item === "Create" ? "" : item + " will be enabled when accounts and track storage are connected.");}}><span className="nav-icon">{item === "Create" ? "✳" : item === "My Library" ? "♫" : "◈"}</span>{item}</button>)}
      <div className="side-spacer"/>
      <div className="credits-card"><div className="credits-top"><span>YOUR CREDITS</span><span className="credit-dot"/></div><strong>— <small>credits</small></strong><p>Credit balances appear after accounts and billing are connected.</p><button className="upgrade" onClick={() => setNotice("Subscription checkout is not connected yet.")}>View plans ↗</button></div>
      <div className="profile"><div className="avatar">N</div><div><strong>NEWSKILL PRO</strong><small>Creator workspace</small></div><span className="dots">···</span></div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="crumb">Studio <span>/</span> <b>{tab}</b></div><div className="top-actions"><span className="status"><i/> Stable Audio engine</span><button className="avatar small-avatar">N</button></div></header>
      <div className="content">
        <div className="eyebrow"><span className="spark">✦</span> YOUR IDEAS. YOUR SOUND.</div>
        <h1>Make something<br/><em>that moves people.</em></h1>
        <p className="intro">Create original instrumental music from a text prompt. Vocal-song generation is not supported by the selected engine yet.</p>
        <div className="mode-switch"><button className="selected">〰 <span>Instrumental</span></button><button disabled title="Vocal generation is not supported by Stable Audio 3.0">♫ <span>Vocals · coming later</span></button></div>
        <form className="generator" onSubmit={submit}>
          <label htmlFor="prompt">DESCRIBE YOUR TRACK</label>
          <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A warm Afrobeats instrumental with rich talking-drum rhythms, melodic guitar, deep bass, an uplifting mood and polished studio production..." maxLength={1200} required/>
          <div className="field-meta"><span>Include genre, instruments, rhythm, mood and production style.</span><span>{prompt.length}/1200</span></div>
          <div className="options-grid"><div><label htmlFor="genre">GENRE</label><select id="genre" value={genre} onChange={e => setGenre(e.target.value)}>{genres.map(g => <option key={g}>{g}</option>)}</select></div><div><label htmlFor="mood">MOOD</label><select id="mood" value={mood} onChange={e => setMood(e.target.value)}>{moods.map(m => <option key={m}>{m}</option>)}</select></div><div><label htmlFor="duration">DURATION</label><select id="duration" value={duration} onChange={e => setDuration(e.target.value)}><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="180">3 minutes</option><option value="240">4 minutes</option><option value="360">6 minutes</option></select></div></div>
          <div className="form-footer"><span className="provider-note"><span>✧</span> Powered by Stability AI · Stable Audio 3.0</span><button className="generate" type="submit" disabled={busy}>{busy ? "Creating…" : "Generate instrumental"} <span>✦</span></button></div>
          {notice && <div className="notice" role="status">{notice}</div>}
          {audioUrl && <div className="audio-result"><label>YOUR GENERATED TRACK</label><audio controls src={audioUrl} className="audio-player">Your browser does not support audio playback.</audio><a className="download-link" href={audioUrl} download={audioName}>Download MP3 ↗</a></div>}
        </form>
        <div className="bottom-note"><span>✧</span><span><b>Made for creators.</b> Build a sound that belongs to you.</span><span className="bottom-right">NEWSKILL PRO © 2026</span></div>
      </div>
    </section>
  </main>;
}
