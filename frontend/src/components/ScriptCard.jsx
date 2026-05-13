import { Link } from 'react-router-dom';
import { MoreVertical, Eye, Copy, Edit3, Trash2, TrendingUp, Film, Hash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDate, truncate } from '../utils/helpers';

const platformColors = {
  instagram: 'bg-pink-600',
  tiktok: 'bg-gray-700',
  'youtube-shorts': 'bg-red-600',
  facebook: 'bg-blue-600',
};

export default function ScriptCard({ script, onDuplicate, onDelete, style: cardStyle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [menuOpen]);

  return (
    <article
      className="card-hover group relative flex flex-col"
      style={cardStyle}
      role="article"
      aria-label={`Script: ${script.title}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-xs font-medium text-white ${platformColors[script.platform] || 'bg-gray-700'}`}
          >
            {script.platform === 'youtube-shorts' ? 'Shorts' : script.platform}
          </span>
          {script.viralScore !== null && script.viralScore !== undefined && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-600/20 text-green-400 text-xs font-medium">
              <TrendingUp size={12} aria-hidden="true" />
              {script.viralScore}
            </span>
          )}
          {script.niche && (
            <span className="chip">
              <Hash size={10} aria-hidden="true" />
              {script.niche}
            </span>
          )}
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-surface-secondary"
            aria-label="Script options"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-10 z-20 w-44 rounded-xl shadow-xl py-1 animate-scale-in"
              style={{ backgroundColor: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}
              role="menu"
            >
              <Link
                to={`/scripts/${script._id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <Eye size={15} /> View
              </Link>
              <button
                onClick={() => { onDuplicate?.(script._id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                role="menuitem"
              >
                <Copy size={15} /> Duplicate
              </button>
              <button
                onClick={() => { onDelete?.(script._id); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                role="menuitem"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Link to={`/scripts/${script._id}`} className="flex-1">
        <h3 className="font-semibold text-lg mb-2 transition-colors line-clamp-2" style={{ color: 'var(--color-text)' }}>
          {truncate(script.title, 60)}
        </h3>
      </Link>

      <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
        {truncate(script.hook, 100)}
      </p>

      {script.scenes?.length > 0 && (
        <div className="flex items-center gap-1 mb-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <Film size={12} aria-hidden="true" />
          <span>{script.scenes.length} scenes</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {script.hashtags?.slice(0, 5).map((tag, i) => (
          <span key={i} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{tag}</span>
        ))}
        {(script.hashtags?.length || 0) > 5 && (
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>+{script.hashtags.length - 5}</span>
        )}
      </div>

      <div
        className="flex items-center justify-between text-xs pt-3 mt-auto"
        style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}
      >
        <span>{formatDate(script.createdAt)}</span>
      </div>
    </article>
  );
}
