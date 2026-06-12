'use client';

import { useEffect, useRef, useState } from 'react';

// Proportional scaling from the 280×607 base spec
const RATIO = 607 / 280;

function PhoneShell({ width, src, alt }) {
  const h   = Math.round(width * RATIO);
  const pad = Math.round(12  * width / 280);
  const rS  = Math.round(55  * width / 280); // shell border-radius
  const rSc = Math.round(44  * width / 280); // screen border-radius
  const rB  = Math.round(51  * width / 280); // inner bezel ring
  const isW = Math.round(110 * width / 280); // Dynamic Island width
  const isH = Math.round(34  * h     / 607); // Dynamic Island height
  const hmW = Math.round(120 * width / 280); // home indicator width
  const bw  = 3.5;                           // button thickness (px)

  // Button vertical positions (proportional to phone height)
  const muteT = Math.round(130 * h / 607);
  const vupT  = Math.round(172 * h / 607);
  const vdnT  = Math.round(240 * h / 607);
  const pwrT  = Math.round(190 * h / 607);

  const btn = (s) => (
    <div aria-hidden="true" style={{ position: 'absolute', background: '#2a2a2a', ...s }} />
  );

  return (
    <div style={{
      width, height: h,
      borderRadius: rS,
      padding: pad,
      background: 'linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 40%, #0d0d0d 70%, #2a2a2a 100%)',
      boxShadow: [
        '0 0 0 1px rgba(255,255,255,0.12)',
        '0 40px 100px rgba(0,0,0,0.8)',
        'inset 0 1px 0 rgba(255,255,255,0.15)',
      ].join(', '),
      position: 'relative',
      boxSizing: 'border-box',
      userSelect: 'none',
    }}>
      {/* Inner bezel ring sits behind screen */}
      <div style={{
        position: 'absolute',
        inset: Math.round(pad * 0.42),
        borderRadius: rB,
        background: 'linear-gradient(160deg, #181818, #080808)',
        zIndex: 0,
      }} />

      {/* Physical side buttons */}
      {btn({ left: -bw, top: muteT,                           width: bw, height: Math.round(28*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ left: -bw, top: vupT,                            width: bw, height: Math.round(56*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ left: -bw, top: vdnT,                            width: bw, height: Math.round(56*h/607), borderRadius: '2px 0 0 2px' })}
      {btn({ right: -bw, top: pwrT,                           width: bw, height: Math.round(84*h/607), borderRadius: '0 2px 2px 0' })}

      {/* Screen */}
      <div style={{
        width: '100%', height: '100%',
        borderRadius: rSc,
        overflow: 'hidden',
        background: '#000',
        position: 'relative',
        zIndex: 1,
      }}>
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            opacity: 1,
            filter: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Dynamic Island */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: Math.round(12 * h / 607),
          left: '50%',
          transform: 'translateX(-50%)',
          width: isW, height: isH,
          background: '#000',
          borderRadius: 20,
          zIndex: 10,
        }} />

        {/* Home indicator */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: 8, left: '50%',
          transform: 'translateX(-50%)',
          width: hmW, height: 5,
          background: 'rgba(255,255,255,0.35)',
          borderRadius: 100,
          zIndex: 10,
        }} />
      </div>
    </div>
  );
}

// phone[0] = home (starts front), phone[1] = splash (starts back)
const PHONES = [
  { id: 'home',   src: '/images/dalili-home.jpg',   alt: "Dalili — écran d'accueil",    width: 270 },
  { id: 'splash', src: '/images/dalili-splash.jpg', alt: 'Dalili — écran de lancement', width: 240 },
];

// Front style: right-aligned in container, upright, full opacity
// Back style:  left-aligned in container, tilted back, dimmed
function frontPos(width)  { return { left: `calc(95% - ${width}px)`, top: 0,  zIndex: 2 }; }
function backPos()        { return { left: '5%',                      top: 40, zIndex: 1 }; }
const FRONT_STYLE = { transform: 'scale(1) rotate(2deg)',    opacity: 1   };
const BACK_STYLE  = { transform: 'scale(0.88) rotate(-4deg)', opacity: 0.5 };

const SWAP_TRANSITION = 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1)';
const POS_TRANSITION  = 'left 0.6s cubic-bezier(0.4,0,0.2,1), top 0.6s cubic-bezier(0.4,0,0.2,1)';

export default function DALILIPhones() {
  // active = index of the front phone (0=home, 1=splash)
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  // Refs to the inner (rotate/scale) div of each phone — for mouse parallax
  const innerRefs = useRef([null, null]);
  // Keep a ref mirror of active so the mouse-parallax effect closure stays fresh
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  // ── Auto-switch every 3.8 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, []);

  // ── Mouse parallax (desktop only, single attachment)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined' || window.innerWidth < 768) return;

    let leaveTimer = null;

    const onMouseEnter = () => {
      clearTimeout(leaveTimer);
      // Remove transition so tilt tracks instantly
      innerRefs.current.forEach(el => { if (el) el.style.transition = 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)'; });
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const rx =  ((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)) * 8;
      const ry = -((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)) * 12;
      const fi = activeRef.current;
      const bi = (fi + 1) % 2;
      const front = innerRefs.current[fi];
      const back  = innerRefs.current[bi];
      if (front) front.style.transform = `scale(1) rotate(2deg) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) translateY(-14px)`;
      if (back)  back.style.transform  = `scale(0.88) rotate(-4deg) rotateX(${(rx*0.6).toFixed(1)}deg) rotateY(${(ry*0.6).toFixed(1)}deg)`;
    };

    const onMouseLeave = () => {
      clearTimeout(leaveTimer);
      const fi = activeRef.current;
      const bi = (fi + 1) % 2;
      const front = innerRefs.current[fi];
      const back  = innerRefs.current[bi];
      // Ease back to rest position
      [front, back].forEach(el => { if (el) el.style.transition = 'transform 0.8s ease, opacity 0.6s cubic-bezier(0.4,0,0.2,1)'; });
      if (front) front.style.transform = FRONT_STYLE.transform;
      if (back)  back.style.transform  = BACK_STYLE.transform;
      leaveTimer = setTimeout(() => {
        // Restore normal swap transition after leave animation finishes
        innerRefs.current.forEach(el => { if (el) el.style.transition = SWAP_TRANSITION; });
      }, 820);
    };

    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mousemove',  onMouseMove, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);
    return () => {
      clearTimeout(leaveTimer);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mousemove',  onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []); // single attachment — reads activeRef.current at call time

  return (
    /*
     * Outer container: position relative, full width of the wrapper,
     * 600px height so absolutely-positioned phones don't collapse it.
     * perspective: 1000px enables the 3D tilt from mouse parallax.
     */
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 600,
        perspective: '1000px',
        pointerEvents: 'auto', // re-enable (parent hero-chip-wrap is pointer-events:none)
      }}
    >
      {PHONES.map((phone, i) => {
        const isFront = i === active;
        const pos     = isFront ? frontPos(phone.width) : backPos();
        const sty     = isFront ? FRONT_STYLE : BACK_STYLE;

        return (
          /*
           * Outer div: position + phoneFloat animation (translateY only).
           * Transition handles left/top swap so phones glide between positions.
           * The animation CSS never changes (only left/top do), so the float
           * continues uninterrupted across active switches.
           */
          <div
            key={phone.id}
            style={{
              position: 'absolute',
              left:     pos.left,
              top:      pos.top,
              zIndex:   pos.zIndex,
              transition: POS_TRANSITION,
              animation: `phoneFloat 4s ease-in-out infinite ${i === 1 ? '0.8s' : '0s'}`,
            }}
          >
            {/*
             * Inner div: rotate + scale + opacity.
             * CSS transition drives the swap animation.
             * Mouse-parallax overrides style.transform directly via innerRefs.
             */}
            <div
              ref={el => { innerRefs.current[i] = el; }}
              style={{
                transform:      sty.transform,
                opacity:        sty.opacity,
                transition:     SWAP_TRANSITION,
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
              }}
            >
              <PhoneShell width={phone.width} src={phone.src} alt={phone.alt} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
