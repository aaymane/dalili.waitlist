import Link from 'next/link';
import { PostMeta, CLUSTER_DEFINITIONS, CLUSTER_MAP } from '@/lib/blog';

interface Props {
  currentSlug: string;
  articles: PostMeta[];
}

export default function ClusterLinks({ currentSlug, articles }: Props) {
  const cluster = CLUSTER_MAP[currentSlug];
  if (!cluster || articles.length === 0) return null;
  const def = CLUSTER_DEFINITIONS[cluster];
  if (!def) return null;

  return (
    <div style={{
      margin: 'clamp(40px,6vw,64px) 0',
      padding: 'clamp(24px,4vw,36px)',
      border: `1px solid rgba(${def.accentRgb},0.2)`,
      borderRadius: 18,
      background: `linear-gradient(135deg, rgba(${def.accentRgb},0.05) 0%, rgba(1,4,16,0.95) 100%)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: def.color, boxShadow: `0 0 8px ${def.color}`,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.52rem', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: def.color,
        }}>Cluster — {def.label}</span>
      </div>

      <p style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '0.82rem', fontWeight: 400,
        color: 'rgba(255,255,255,0.65)',
        margin: '0 0 20px', lineHeight: 1.6,
      }}>{def.description}</p>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {articles.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.88rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.65)',
              transition: 'color 0.2s',
            }}>
              <span style={{ color: `rgba(${def.accentRgb},0.6)`, fontSize: '0.7rem' }}>→</span>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
