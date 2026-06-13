'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Phase = 'lines' | 'impact' | 'logo' | 'text';

// ─── Particle config: angle (deg), travel distance (px), dot size (px) ───────
const PARTICLES = [
  { angle:  12, dist: 74, size: 4 },
  { angle:  62, dist: 61, size: 3 },
  { angle: 115, dist: 84, size: 5 },
  { angle: 168, dist: 67, size: 3 },
  { angle: 215, dist: 79, size: 4 },
  { angle: 270, dist: 65, size: 5 },
  { angle: 318, dist: 89, size: 3 },
  { angle: 355, dist: 73, size: 4 },
];

// ─── Ease presets ────────────────────────────────────────────────────────────
const EXPO_OUT  = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4,  0, 0.6, 1] as const;

// ─── Component ───────────────────────────────────────────────────────────────
export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [show,  setShow]  = useState(false);
  const [phase, setPhase] = useState<Phase>('lines');
  const cb = useRef(onComplete);
  useEffect(() => { cb.current = onComplete; }, [onComplete]);

  useEffect(() => {
    // Reduced-motion: skip immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cb.current();
      return;
    }
    // Already played this session: skip
    if (sessionStorage.getItem('dalili_intro_seen')) {
      cb.current();
      return;
    }

    setShow(true);

    const T = [
      //  800ms — lines arrive, impact fires
      setTimeout(() => setPhase('impact'),  800),
      // 1150ms — flash done, particles still scattering, logo settled
      setTimeout(() => setPhase('logo'),   1150),
      // 1500ms — text letters stagger in
      setTimeout(() => setPhase('text'),   1500),
      // 2450ms — reveal site beneath overlay, begin exit
      setTimeout(() => { cb.current(); setShow(false); }, 2450),
    ];

    return () => T.forEach(clearTimeout);
  }, []);

  // ─── Visibility flags ────────────────────────────────────────────────────
  const showLines     = phase === 'lines';
  const showFlash     = phase === 'impact';
  const showLogo      = phase !== 'lines';
  const showParticles = phase === 'impact' || phase === 'logo';
  const showText      = phase === 'text';

  return (
    <AnimatePresence onExitComplete={() => sessionStorage.setItem('dalili_intro_seen', '1')}>
      {show && (
        <motion.div
          key="dalili-intro"
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.62, ease: EXIT_EASE } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#040d1e',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >

          {/* ── Ambient depth glow — expands from center as logo appears ─── */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                key="amb"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.25 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: EXPO_OUT }}
                style={{
                  position: 'absolute',
                  width:  'clamp(380px, 68vmin, 900px)',
                  height: 'clamp(380px, 68vmin, 900px)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(29,78,216,0.04) 52%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Full-screen drawing lines ──────────────────────────────────── */}
          <AnimatePresence>
            {showLines && (
              <motion.div
                key="lines"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.1 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              >
                {/*
                  SVG uses a 100×56.25 viewBox (16:9) — paths are expressed as %
                  of screen dimensions. Center of viewport = (50, 28.125).

                  Left line:  enters top-left corner, S-curves to center.
                  Right line: enters bottom-right corner, S-curves to center.
                  Each path is drawn twice:
                    1. Wide soft glow halo  (strokeWidth 5, low opacity)
                    2. Bright electric core (strokeWidth 1.1, full brightness + filter)
                */}
                <svg
                  viewBox="0 0 100 56.25"
                  preserveAspectRatio="xMidYMid meet"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  <defs>
                    <filter id="dlg" x="-200%" y="-200%" width="500%" height="500%"
                      colorInterpolationFilters="sRGB">
                      <feGaussianBlur stdDeviation="0.65" result="b" />
                      {/* Shift hue toward electric blue */}
                      <feColorMatrix in="b" type="matrix"
                        values="0 0 0 0 0.37  0 0 0 0 0.64  0 0 0 0 0.98  0 0 0 2.4 0"
                        result="g" />
                      <feMerge>
                        <feMergeNode in="g" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Left → center */}
                  <motion.path
                    d="M -20,19.5 C 6,11 24,21 34,25.5 C 43.5,29.5 47.5,28.1 50,28.125"
                    fill="none" stroke="rgba(96,165,250,0.28)"
                    strokeWidth="5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.76, ease: EXPO_OUT }}
                  />
                  <motion.path
                    d="M -20,19.5 C 6,11 24,21 34,25.5 C 43.5,29.5 47.5,28.1 50,28.125"
                    fill="none" stroke="#93c5fd"
                    strokeWidth="1.1" strokeLinecap="round"
                    filter="url(#dlg)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.76, ease: EXPO_OUT }}
                  />

                  {/* Right → center */}
                  <motion.path
                    d="M 120,36.75 C 94,45 76,35 66.5,30.75 C 57,26.8 52.5,28.1 50,28.125"
                    fill="none" stroke="rgba(96,165,250,0.28)"
                    strokeWidth="5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.76, ease: EXPO_OUT }}
                  />
                  <motion.path
                    d="M 120,36.75 C 94,45 76,35 66.5,30.75 C 57,26.8 52.5,28.1 50,28.125"
                    fill="none" stroke="#93c5fd"
                    strokeWidth="1.1" strokeLinecap="round"
                    filter="url(#dlg)"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.76, ease: EXPO_OUT }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── White impact flash ─────────────────────────────────────────── */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                key="flash"
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, background: '#fff', pointerEvents: 'none', zIndex: 5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.72, 0] }}
                transition={{ duration: 0.38, times: [0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>

          {/* ── Logo icon + particles ──────────────────────────────────────── */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                key="logo"
                style={{ position: 'relative', width: 96, height: 96, marginBottom: 24, flexShrink: 0 }}
                initial={{ scale: 0.36, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 255, damping: 22, mass: 0.88 }}
              >
                {/* Particles — scatter from the logo center on impact */}
                <AnimatePresence>
                  {showParticles && PARTICLES.map((p, i) => {
                    const r = (p.angle * Math.PI) / 180;
                    return (
                      <motion.span
                        key={`p${i}`}
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          marginTop: -p.size / 2, marginLeft: -p.size / 2,
                          width: p.size, height: p.size,
                          borderRadius: '50%',
                          background: '#93c5fd',
                          boxShadow: '0 0 5px #60a5fa, 0 0 12px rgba(59,130,246,0.65)',
                          pointerEvents: 'none',
                        }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 2 }}
                        animate={{
                          x: Math.cos(r) * p.dist,
                          y: Math.sin(r) * p.dist,
                          opacity: 0, scale: 0,
                        }}
                        exit={{ opacity: 0, scale: 0, transition: { duration: 0.12 } }}
                        transition={{
                          duration: 0.68 + (i % 3) * 0.1,
                          delay: i * 0.016,
                          ease: [0.2, 1, 0.8, 1],
                        }}
                      />
                    );
                  })}
                </AnimatePresence>

                {/* Breathing glow ring */}
                <motion.span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    position: 'absolute', inset: -22, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.48) 0%, rgba(37,99,235,0.15) 54%, transparent 74%)',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: [0.55, 1, 0.55], scale: [0.88, 1.14, 0.88] }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Logo mark */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-dalili.svg"
                  alt=""
                  aria-hidden="true"
                  style={{
                    display: 'block', width: '100%', height: '100%',
                    position: 'relative', zIndex: 1,
                    filter: [
                      'drop-shadow(0 0 22px rgba(59,130,246,0.95))',
                      'drop-shadow(0 0 8px rgba(37,99,235,0.88))',
                      'drop-shadow(0 0 2px rgba(147,197,253,0.6))',
                    ].join(' '),
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── "DALILI" letter-by-letter stagger ─────────────────────────── */}
          <AnimatePresence>
            {showText && (
              <motion.div
                key="txt"
                style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.3em' }}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -5, transition: { duration: 0.2 } }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.076 } },
                }}
              >
                {'DALILI'.split('').map((ch, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
                      show: {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        transition: { duration: 0.42, ease: EXPO_OUT },
                      },
                    }}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-montserrat, "Montserrat", sans-serif)',
                      fontWeight: 700,
                      fontSize: 'clamp(1.7rem, 5.5vw, 2.4rem)',
                      color: '#fff',
                      letterSpacing: '0.3em',
                      lineHeight: 1,
                    }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
