'use client';

import { useEffect, useRef, useState } from 'react';

const SCREENS = [
  { src: '/images/dalili-splash.jpg', alt: 'Dalili — écran de lancement' },
  { src: '/images/dalili-home.jpg',   alt: "Dalili — écran d'accueil" },
];

function PhysicalButtons() {
  const btn = (style) => (
    <div aria-hidden="true" style={{
      position: 'absolute',
      background: 'linear-gradient(180deg, #2e2e32 0%, #1e1e20 50%, #2a2a2e 100%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)',
      borderRadius: 3,
      ...style,
    }} />
  );

  return (
    <>
      {/* Mute switch */}
      {btn({ left: -4, top: 68, width: 4, height: 26, borderRadius: '3px 0 0 3px' })}
      {/* Vol+ */}
      {btn({ left: -4, top: 108, width: 4, height: 42, borderRadius: '3px 0 0 3px' })}
      {/* Vol- */}
      {btn({ left: -4, top: 162, width: 4, height: 42, borderRadius: '3px 0 0 3px' })}
      {/* Power */}
      {btn({ right: -4, top: 124, width: 4, height: 58, borderRadius: '0 3px 3px 0' })}
    </>
  );
}

export default function DALILIPhones() {
  const [active, setActive] = useState(0);
  const outerRef = useRef(null); // pointer-events layer
  const tiltRef  = useRef(null); // JS tilt + phonesRotateY CSS animation

  // Auto-switch every 3.8 s
  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % 2), 3800);
    return () => clearInterval(id);
  }, []);

  // Mouse-tilt: pause CSS rotateY animation, apply rotateX/Y via JS, reset on leave
  useEffect(() => {
    const outer = outerRef.current;
    const tilt  = tiltRef.current;
    if (!outer || !tilt) return;

    let leaveTimer = null;

    const onMouseEnter = () => {
      clearTimeout(leaveTimer);
      tilt.style.animationPlayState = 'paused';
      tilt.style.transition = 'none';
    };

    const onMouseMove = (e) => {
      const rect = outer.getBoundingClientRect();
      const dx = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)));
      tilt.style.transform = `perspective(1000px) rotateX(${(-dy * 15).toFixed(1)}deg) rotateY(${(dx * 15).toFixed(1)}deg)`;
    };

    const onMouseLeave = () => {
      tilt.style.transition = 'transform 0.6s ease';
      tilt.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      leaveTimer = setTimeout(() => {
        tilt.style.transition = '';
        tilt.style.transform = '';
        tilt.style.animationPlayState = '';
      }, 640);
    };

    outer.addEventListener('mouseenter', onMouseEnter);
    outer.addEventListener('mousemove',  onMouseMove);
    outer.addEventListener('mouseleave', onMouseLeave);
    return () => {
      clearTimeout(leaveTimer);
      outer.removeEventListener('mouseenter', onMouseEnter);
      outer.removeEventListener('mousemove',  onMouseMove);
      outer.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    /* Perspective parent — pointer events re-enabled so tilt works */
    <div
      ref={outerRef}
      style={{
        perspective: '1000px',
        display: 'inline-block',
        pointerEvents: 'auto',
      }}
    >
      {/* JS-tilt target + slow rotateY CSS animation */}
      <div
        ref={tiltRef}
        style={{
          transformStyle: 'preserve-3d',
          animation: 'phonesRotateY 6s ease-in-out infinite alternate',
        }}
      >
        {/* Float up/down CSS animation */}
        <div style={{
          animation: 'phonesFloat 3s ease-in-out infinite alternate',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 14,
          transformStyle: 'preserve-3d',
        }}>
          {SCREENS.map((screen, i) => {
            const isActive = active === i;
            return (
              <div
                key={i}
                style={{
                  transition: 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)',
                  transform: isActive ? 'scale(1)' : 'scale(0.87)',
                  opacity:   isActive ? 1 : 0.32,
                  transformOrigin: 'bottom center',
                }}
              >
                {/* iPhone chassis — dark titanium */}
                <div style={{
                  width: 130,
                  height: 280,
                  borderRadius: 52,
                  background: 'linear-gradient(145deg, #404044 0%, #2e2e32 22%, #1c1c1e 52%, #26262a 78%, #343438 100%)',
                  boxShadow: [
                    '0 0 0 0.5px rgba(255,255,255,0.14)',
                    '0 0 0 1px rgba(0,0,0,0.85)',
                    '0 36px 80px rgba(0,0,0,0.72)',
                    '0 8px 28px rgba(0,0,0,0.55)',
                    'inset 0 1.5px 0 rgba(255,255,255,0.1)',
                    'inset 0 -1px 0 rgba(0,0,0,0.55)',
                    'inset 1px 0 0 rgba(255,255,255,0.04)',
                    'inset -1px 0 0 rgba(0,0,0,0.25)',
                  ].join(', '),
                  position: 'relative',
                  padding: 7,
                  boxSizing: 'border-box',
                  userSelect: 'none',
                }}>
                  <PhysicalButtons />

                  {/* Screen bezel */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 40,
                    overflow: 'hidden',
                    background: '#000',
                    position: 'relative',
                  }}>
                    <img
                      src={screen.src}
                      alt={screen.alt}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        borderRadius: 40,
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Dynamic Island */}
                    <div aria-hidden="true" style={{
                      position: 'absolute',
                      top: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 62,
                      height: 17,
                      background: '#000',
                      borderRadius: 100,
                      zIndex: 5,
                    }} />

                    {/* Home indicator */}
                    <div aria-hidden="true" style={{
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 52,
                      height: 3.5,
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: 100,
                      zIndex: 5,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
