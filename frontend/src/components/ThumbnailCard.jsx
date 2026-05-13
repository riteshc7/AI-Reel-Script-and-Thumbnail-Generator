import { Trash2, Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function ThumbnailCard({ thumbnail, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const handleDownload = () => {
    if (!thumbnail.imageData) return;
    const link = document.createElement('a');
    link.href = thumbnail.imageData;
    link.download = `thumbnail-${thumbnail._id}.jpg`;
    link.click();
  };

  return (
    <article
      className="card-hover group relative flex flex-col"
      role="article"
      aria-label={`Thumbnail: ${thumbnail.prompt}`}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
        {thumbnail.status === 'completed' && thumbnail.imageData && !imgError ? (
          <img
            src={thumbnail.imageData}
            alt={thumbnail.prompt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
            onClick={() => setZoomed(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : thumbnail.status === 'pending' ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <RefreshCw size={24} className="animate-spin-slow" style={{ color: 'var(--color-text-muted)' }} />
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Generating...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {imgError ? 'Load failed' : 'Generation failed'}
            </p>
          </div>
        )}
      </div>

      <p className="text-sm line-clamp-2 mb-3 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
        {thumbnail.prompt}
      </p>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            thumbnail.status === 'completed' ? 'bg-green-600/20 text-green-400' :
            thumbnail.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
            'bg-red-600/20 text-red-400'
          }`}
        >
          {thumbnail.status}
        </span>
        <div className="flex gap-1">
          {thumbnail.status === 'completed' && !imgError && (
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg transition-all hover:bg-surface-secondary active:scale-90"
              aria-label="Download thumbnail"
            >
              <Download size={14} style={{ color: 'var(--color-text-muted)' }} />
            </button>
          )}
          <button
            onClick={() => onDelete?.(thumbnail._id)}
            className="p-1.5 rounded-lg transition-all hover:bg-red-600/10 active:scale-90"
            aria-label="Delete thumbnail"
          >
            <Trash2 size={14} className="text-red-400" />
          </button>
        </div>
      </div>

      {zoomed && thumbnail.imageData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Thumbnail preview"
        >
          <img
            src={thumbnail.imageData}
            alt={thumbnail.prompt}
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close preview"
          >
            &times;
          </button>
        </div>
      )}
    </article>
  );
}
