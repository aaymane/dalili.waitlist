'use client';

import { useState } from 'react';
import { CheckCircle2, Download, X } from 'lucide-react';

interface Props {
  label?: string;
  size?: 'default' | 'large';
}

export default function DownloadBtn({ label = 'Télécharger — Gratuit', size = 'default' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  function handleDownload() {
    if (status !== 'idle') return;
    setStatus('loading');
    // Trigger browser download
    const a = document.createElement('a');
    a.href = '/api/checklist';
    a.download = 'checklist-arrivee-france-dalili-2026.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Show success after short delay
    setTimeout(() => setStatus('done'), 800);
  }

  const pad   = size === 'large' ? '16px 40px' : 'clamp(14px,2vw,18px) clamp(28px,3.5vw,44px)';
  const fSize = size === 'large' ? '0.86rem'  : 'clamp(0.75rem,1.1vw,0.9rem)';

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={status !== 'idle'}
        className="ck-download-btn"
        style={{
          padding: pad,
          background: status === 'loading'
            ? 'rgba(1,77,248,0.6)'
            : status === 'done'
            ? 'linear-gradient(135deg,#16a34a 0%,#15803d 100%)'
            : 'linear-gradient(135deg,#014DF8 0%,#0066ff 100%)',
          borderRadius: 14,
          border: 'none',
          cursor: status !== 'idle' ? 'default' : 'pointer',
          fontFamily: 'var(--font-montserrat)',
          fontWeight: 700,
          fontSize: fSize,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: '#fff',
          boxShadow: status === 'done'
            ? '0 0 48px rgba(22,163,74,0.45)'
            : '0 0 48px rgba(1,77,248,0.4), 0 2px 0 rgba(255,255,255,0.08) inset',
          transition: 'background 0.35s ease, box-shadow 0.35s ease',
          whiteSpace: 'nowrap' as const,
        }}
      >
        {status === 'loading' ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              <path d="M12 3a9 9 0 0 1 9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Préparation…
          </>
        ) : status === 'done' ? (
          <>
            <CheckCircle2 size={15} strokeWidth={2.5} aria-hidden="true" />
            Téléchargé !
          </>
        ) : (
          <>
            <Download size={15} strokeWidth={2} aria-hidden="true" />
            {label}
          </>
        )}
      </button>

      {/* ── Success overlay ── */}
      {status === 'done' && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
            background: 'rgba(1,4,16,0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setStatus('idle')}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 480,
              background: 'linear-gradient(160deg, rgba(22,163,74,0.12) 0%, rgba(1,4,16,0.98) 60%)',
              border: '1px solid rgba(22,163,74,0.3)',
              borderRadius: 24,
              padding: 'clamp(32px,5vw,48px)',
              position: 'relative',
              boxShadow: '0 0 80px rgba(22,163,74,0.12), 0 32px 80px rgba(0,0,0,0.6)',
              textAlign: 'center',
              animation: 'slideUp 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {/* Top accent */}
            <div aria-hidden="true" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              borderRadius: '24px 24px 0 0',
              background: 'linear-gradient(90deg, transparent, rgba(22,163,74,0.9), rgba(74,222,128,1), rgba(22,163,74,0.9), transparent)',
            }} />

            {/* Close */}
            <button
              onClick={() => setStatus('idle')}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
              }}
            >
              <X size={14} strokeWidth={2} />
            </button>

            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(22,163,74,0.12)',
                border: '1px solid rgba(22,163,74,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle2 size={34} color="#22c55e" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(2rem,5vw,2.8rem)',
              letterSpacing: '0.04em', lineHeight: 0.95,
              color: '#fff', margin: '0 0 12px',
            }}>
              TON PDF EST EN ROUTE !
            </h2>

            <p style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.95rem', fontWeight: 300,
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.75,
              margin: '0 0 28px',
            }}>
              La checklist <strong style={{ color: '#fff', fontWeight: 600 }}>32 démarches</strong> est en train
              de se télécharger dans ton appareil.{' '}
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>Imprime-la, coche au fur et à mesure, et partage-la à tes amis.</span>
            </p>

            {/* Tips */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '18px 20px',
              marginBottom: 28, textAlign: 'left',
            }}>
              <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.7)', margin: '0 0 12px' }}>
                Prochaine étape
              </p>
              {[
                'Rejoins la communauté Dalili — des mentors t\'attendent',
                'Lis nos guides pour chaque démarche en détail',
                'Partage ce PDF dans tes groupes WhatsApp / Facebook',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4d8fff', flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{tip}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStatus('idle')}
              style={{
                width: '100%', padding: '13px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
