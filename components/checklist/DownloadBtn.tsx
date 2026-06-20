'use client';

import { useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';

interface Props {
  label?: string;
  size?: 'default' | 'large';
}

export default function DownloadBtn({ label = 'Télécharger — Gratuit', size = 'default' }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  function handleDownload() {
    if (status !== 'idle') return;
    setStatus('loading');
    const a = document.createElement('a');
    a.href = '/api/checklist';
    a.download = 'checklist-arrivee-france-dalili-2026.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    }, 800);
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
