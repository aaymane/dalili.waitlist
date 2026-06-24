import React from 'react';

interface KeyFactsProps {
  f1?: string;
  f2?: string;
  f3?: string;
  f4?: string;
  f5?: string;
  source?: string;
}

export default function KeyFacts({ f1, f2, f3, f4, f5, source }: KeyFactsProps) {
  const facts = [f1, f2, f3, f4, f5].filter(Boolean) as string[];
  if (facts.length === 0) return null;

  return (
    <div
      style={{
        background: 'rgba(1,77,248,0.06)',
        borderLeft: '3px solid #014DF8',
        borderRadius: '0 12px 12px 0',
        padding: '20px 24px',
        margin: '24px 0',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-montserrat, system-ui)',
          fontSize: '12px',
          fontWeight: 700,
          color: '#4d8fff',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: '0 0 12px',
        }}
      >
        📌 Points clés
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {facts.map((fact, i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--font-dm-sans, system-ui)',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.82)',
              lineHeight: 1.7,
              marginBottom: i < facts.length - 1 ? 6 : 0,
              paddingLeft: 18,
              position: 'relative',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 4,
                top: '0.6em',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#014DF8',
                display: 'inline-block',
              }}
            />
            {fact}
          </li>
        ))}
      </ul>
      {source && (
        <p
          style={{
            fontFamily: 'var(--font-dm-sans, system-ui)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            margin: '12px 0 0',
          }}
        >
          Source : {source}
        </p>
      )}
    </div>
  );
}
