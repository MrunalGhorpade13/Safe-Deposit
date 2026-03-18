"use client";

import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/Navbar").then(mod => mod.Navbar), { ssr: false });
const Dashboard = dynamic(() => import("@/components/Dashboard").then(mod => mod.Dashboard), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative', background: '#030712' }}>
      {/* Animated background blobs */}
      <div className="background-blobs" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '960px', width: '100%', margin: '0 auto', padding: '32px 16px 48px' }}>
          {/* Hero header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '20px', marginBottom: '16px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#818cf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Level 4 — Stellar Soroban
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, marginBottom: '12px' }}>
              Decentralized Lease{' '}
              <span className="gradient-text">Escrow</span>
            </h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
              Lock, manage, and release rental deposits on the Stellar blockchain — transparent, instant, and completely trustless.
            </p>
          </div>

          <Dashboard />
        </main>
      </div>
    </div>
  );
}
