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
      setAudioName(`newskill-soniq-${genre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}.mp3`);
      setNotice("Your instrumental is ready. Listen below or download the audio.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Something went wrong. No track was created.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" aria-label="NEWSKILL SONIQ AI home"><span className="brand-mark">N<span>♫</span></span><span className="brand-copy">NEWSKILL<small>SONIQ AI STUDIO</small></span></a>
      <div className="workspace-label">YOUR WORKSPACE</div>
      {["Create", "My Library", "Explore"].map(item => <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => {setTab(item); setNotice(item === "Create" ? "" : item + " will be available when user accounts and saved-track storage are connected.");}}><span className="nav-icon">{item === "Create" ? "✳" : item === "My Library" ? "♫" : "◈"}</span>{item}</button>)}
      <div className="side-spacer"/>
      <div className="credits-card"><div className="credits-top"><span>YOUR CREDITS</span><span className="credit-dot"/></div><strong>— <small>credits</small></strong><p>Credits and subscriptions will appear after accounts and billing are connected.</p><button className="upgrade" onClick={() => setNotice("Subscriptions are not connected yet. Payment setup is required before charging customers.")}>Explore plans ↗</button></div>
      <div className="profile"><div className="avatar">N</div><div><strong>NEWSKILL SONIQ AI</strong><small>Creator studio</small></div></div>
      <div className="sidebar-contact"><span>NEED A HAND?</span><a href="mailto:daudasaidu425@gmail.com">daudasaidu425@gmail.com</a><a href="tel:09138608021">09138608021</a></div>
    </aside>
    <section className="main">
      <header className="topbar"><div className="crumb">Studio <span>/</span> <b>{tab}</b></div><div className="top-actions"><span className="status"><i/> Music studio</span><div className="avatar small-avatar">N</div></div></header>
      <div className="content">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="spark">✦</span> YOUR IDEAS. YOUR SOUND.</div>
            <h1>Make your sound.<br/><em>Make your mark.</em></h1>
            <p className="intro">Your creative space for turning musical ideas into instrumentals. Explore Afrobeats, Amapiano, Nupe fusion and more.</p>
            <div className="hero-pills"><span>✦ AI-assisted creation</span><span>♫ African sounds welcome</span></div>
          </div>
          <div className="singer-card" role="img" aria-label="Singer in a recording studio wearing headphones and performing into a microphone">
            <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85" alt="Singer performing into a microphone in a studio" />
            <div className="singer-overlay"><span className="live-dot"/> THE SOUND STARTS HERE</div>
            <div className="sound-bars" aria-hidden="true">{Array.from({length:24}, (_,i)=><i key={i} style={{height:`${14+((i*17+11)%38)}px`}}/>)}</div>
          </div>
        </section>
        <div className="section-heading"><div><span className="section-kicker">SONIQ STUDIO</span><h2>What are we making today?</h2></div><span className="beta-tag">INSTRUMENTAL GENERATOR</span></div>
        <div className="mode-switch"><button className="selected">〰 <span>Instrumental</span></button><button disabled title="Vocal-song generation requires a provider that supports full vocal tracks">♫ <span>Full songs with vocals · coming later</span></button></div>
        <form className="generator" onSubmit={submit}>
          <label htmlFor="prompt">DESCRIBE YOUR TRACK</label>
          <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="A warm Afrobeats instrumental with talking drums, melodic guitar, deep bass, uplifting energy and polished studio production…" maxLength={1200} required/>
          <div className="field-meta"><span>Tip: include genre, instruments, rhythm, mood and production style.</span><span>{prompt.length}/1200</span></div>
          <div className="options-grid"><div><label htmlFor="genre">GENRE</label><select id="genre" value={genre} onChange={e => setGenre(e.target.value)}>{genres.map(g => <option key={g}>{g}</option>)}</select></div><div><label htmlFor="mood">MOOD</label><select id="mood" value={mood} onChange={e => setMood(e.target.value)}>{moods.map(m => <option key={m}>{m}</option>)}</select></div><div><label htmlFor="duration">DURATION</label><select id="duration" value={duration} onChange={e => setDuration(e.target.value)}><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120">2 minutes</option><option value="180">3 minutes</option><option value="240">4 minutes</option><option value="360">6 minutes</option></select></div></div>
          <div className="form-footer"><span className="provider-note"><span>✧</span> Instrumental engine · API setup required</span><button className="generate" type="submit" disabled={busy}>{busy ? "Creating…" : "Generate instrumental"} <span>✦</span></button></div>
          {notice && <div className="notice" role="status">{notice}</div>}
          {audioUrl && <div className="audio-result"><label>YOUR GENERATED TRACK</label><audio controls src={audioUrl} className="audio-player">Your browser does not support audio playback.</audio><a className="download-link" href={audioUrl} download={audioName}>Download audio ↗</a></div>}
        </form>
        <footer className="bottom-note"><span>✧</span><span><b>Built for creators.</b> Made by NEWSKILL PRO.</span><span className="bottom-right">NEWSKILL SONIQ AI © 2026</span></footer>
      </div>
    </section>
  </main>;
}
