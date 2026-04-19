'use client';
// app/(hub)/wiki/[gameSlug]/page.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { useAppStore } from '@/store/useAppStore';
import type { WikiSection, LayersMetadata, TipsMetadata, TableMetadata } from '@/types';

export default function WikiPage() {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const { t, language } = useAppStore();
  const [sections, setSections] = useState<WikiSection[]>([]);
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWiki = async () => {
      const supabase = createClient();
      const { data: game } = await supabase
        .from('games')
        .select('id, name')
        .eq('slug', gameSlug)
        .single();

      if (!game) { setLoading(false); return; }
      setGameName(game.name);

      const { data } = await supabase
        .from('game_wiki')
        .select('*')
        .eq('game_id', game.id)
        .order('display_order');

      setSections((data as WikiSection[]) ?? []);
      setLoading(false);
    };
    fetchWiki();
  }, [gameSlug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <Link
          href={`/games/${gameSlug}`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-3"
        >
          ← {t('wiki.backToGame')}
        </Link>
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <span>📚</span>
          <span>{gameName} — {t('wiki.title')}</span>
        </h1>
      </div>

      {sections.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-muted">No hay contenido wiki disponible aún.</p>
        </div>
      ) : (
        sections.map((section) => (
          <WikiSectionCard key={section.id} section={section} language={language} />
        ))
      )}
    </div>
  );
}

/* ── Wiki Section Renderer ── */
function WikiSectionCard({ section, language }: { section: WikiSection; language: string }) {
  const title = language === 'en' ? section.section_title_en : section.section_title;
  const content = language === 'en' ? section.content_en : section.content;

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fadeIn">
      {/* Section header */}
      <div className="px-5 py-4 border-b border-subtle">
        <h2 className="font-bold text-lg">{title}</h2>
        {content && <p className="text-sm text-muted mt-1">{content}</p>}
      </div>

      {/* Section content */}
      <div className="p-5">
        {section.content_type === 'layers' && (
          <LayersRenderer metadata={section.metadata as LayersMetadata} language={language} />
        )}
        {section.content_type === 'tips' && (
          <TipsRenderer metadata={section.metadata as TipsMetadata} language={language} />
        )}
        {section.content_type === 'table' && (
          <TableRenderer metadata={section.metadata as TableMetadata} language={language} />
        )}
        {section.content_type === 'text' && (
          <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
}

/* ── Layers renderer (ej: Minecraft minerales) ── */
function LayersRenderer({ metadata, language }: { metadata: LayersMetadata; language: string }) {
  if (!metadata?.layers) return null;
  return (
    <div className="space-y-2">
      {metadata.layers.map((layer, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-tertiary"
          style={{ borderLeft: `3px solid ${layer.color}` }}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: layer.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {language === 'en' ? layer.resource_en : layer.resource}
              </span>
              {layer.tip && (
                <span className="text-xs text-muted">— {layer.tip}</span>
              )}
            </div>
            <div className="text-xs text-muted font-mono">{layer.y}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Tips renderer ── */
function TipsRenderer({ metadata, language }: { metadata: TipsMetadata; language: string }) {
  if (!metadata?.tips) return null;
  return (
    <div className="grid gap-2">
      {metadata.tips.map((tip, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-tertiary hover:bg-secondary transition-colors"
        >
          <DynamicIcon name={tip.icon || ''} className="w-5 h-5 flex-shrink-0 text-blue-400" />
          <p className="text-sm">{language === 'en' ? tip.tip_en : tip.tip}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Table renderer ── */
function TableRenderer({ metadata, language }: { metadata: TableMetadata; language: string }) {
  if (!metadata?.rows) return null;
  const headers = language === 'en' ? (metadata.headers_en ?? metadata.headers) : metadata.headers;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-subtle">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 text-xs text-muted uppercase tracking-wide font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metadata.rows.map((row, i) => (
            <tr key={i} className="border-b border-subtle last:border-0 hover:bg-tertiary transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-2.5 px-3 text-sm">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
