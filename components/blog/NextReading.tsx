import Link from 'next/link';
import { PostMeta, CATEGORY_COLORS } from '@/lib/blog';

interface Props {
  articles: PostMeta[];
}

export default function NextReading({ articles }: Props) {
  if (articles.length === 0) return null;

  return (
    <div style={{ margin: 'clamp(48px,7vw,72px) 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <span style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.55rem', fontWeight: 700,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          whiteSpace: 'nowrap',
        }}>À lire ensuite</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px,100%), 1fr))',
        gap: 'clamp(12px,2vw,20px)',
      }}>
        {articles.map(post => {
          const cat = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.Visa;
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                padding: 'clamp(18px,2.5vw,26px)',
                background: `linear-gradient(145deg, rgba(${cat.accentRgb},0.06) 0%, rgba(1,4,16,0.98) 100%)`,
                border: `1px solid rgba(${cat.accentRgb},0.15)`,
                borderRadius: 16,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)`,
                }} />
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: cat.accent, flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.48rem', fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: cat.accent,
                  }}>{post.category}</span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-bebas)',
                  fontWeight: 400,
                  fontSize: 'clamp(1.1rem,1.8vw,1.4rem)',
                  lineHeight: 1.05, letterSpacing: '0.02em',
                  color: '#fff', margin: '0 0 8px',
                }}>{post.title}</p>
                <span style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.5rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: cat.accent,
                }}>Lire →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
