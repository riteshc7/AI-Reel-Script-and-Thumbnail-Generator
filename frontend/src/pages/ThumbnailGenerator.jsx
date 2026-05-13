import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Image, Sparkles, Loader2, Trash2, Download, RefreshCw, Search, ArrowUpDown } from 'lucide-react';
import { generateThumbnail, getThumbnails, deleteThumbnail } from '../api/thumbnails';
import ThumbnailCard from '../components/ThumbnailCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ThumbnailGenerator() {
  const [searchParams] = useSearchParams();
  const scriptTopic = searchParams.get('topic') || '';
  const scriptId = searchParams.get('script') || '';

  const [prompt, setPrompt] = useState(scriptTopic || '');
  const [loading, setLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { loadThumbnails(); }, []);

  async function loadThumbnails() {
    try {
      const data = await getThumbnails();
      setThumbnails(data);
    } catch {
      // ignore
    } finally {
      setLoadingList(false);
    }
  }

  function getSuggestedPrompts(topic) {
    return [
      `${topic} YouTube thumbnail bold colors dramatic lighting text overlay`,
      `${topic} split screen before and after transformation viral thumbnail`,
      `${topic} close up face shocked expression vibrant thumbnail`,
      `${topic} 3D text bold typography cinematic thumbnail dark background`,
      `${topic} colorful abstract gradient modern aesthetic poster`,
    ];
  }

  async function handleGenerate(suggestedPrompt) {
    const finalPrompt = suggestedPrompt || prompt;
    if (!finalPrompt) {
      toast.error('Please enter a prompt');
      return;
    }
    setLoading(true);
    try {
      const result = await generateThumbnail({ prompt: finalPrompt, scriptId: scriptId || undefined });
      toast.success('Thumbnail generated!');
      setThumbnails((prev) => [result, ...prev]);
      if (!suggestedPrompt) setPrompt('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteThumbnail(id);
      setThumbnails((prev) => prev.filter(t => t._id !== id));
      toast.success('Thumbnail deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  const suggestedPrompts = scriptTopic ? getSuggestedPrompts(scriptTopic) : [];

  const filteredThumbnails = useMemo(() => {
    let list = [...thumbnails];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.prompt?.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') {
      list = list.filter(t => t.status === statusFilter);
    }
    return list;
  }, [thumbnails, search, statusFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
          <Image className="text-purple-400" aria-hidden="true" />
          Thumbnail Generator
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Generate AI thumbnails and posters for your content</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label htmlFor="thumb-prompt" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            Describe your thumbnail
          </label>
          <textarea
            id="thumb-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="e.g. A dramatic split screen showing transformation, bold text overlay, vibrant colors..."
          />
        </div>
        <button
          onClick={() => handleGenerate()}
          disabled={loading || !prompt}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Generating...</>
          ) : (
            <><Sparkles size={18} /> Generate Thumbnail</>
          )}
        </button>

        {suggestedPrompts.length > 0 && (
          <div className="animate-slide-up">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Suggested Prompts</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((sp, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerate(sp)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80 active:scale-95"
                  style={{ backgroundColor: 'var(--color-surface-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                >
                  {sp.length > 60 ? sp.slice(0, 60) + '...' : sp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Generated Thumbnails</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-8 py-2 text-sm w-40 lg:w-48"
                placeholder="Search..."
                aria-label="Search thumbnails"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 text-sm w-28"
              aria-label="Filter by status"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button onClick={loadThumbnails} className="btn-secondary p-2.5" aria-label="Refresh thumbnails">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {loadingList ? (
          <LoadingSpinner text="Loading thumbnails..." />
        ) : filteredThumbnails.length === 0 ? (
          <div className="card text-center py-16">
            <Image size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {search || statusFilter !== 'all' ? 'No thumbnails match your filters' : 'No thumbnails yet. Generate your first one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredThumbnails.map((thumb) => (
              <ThumbnailCard key={thumb._id} thumbnail={thumb} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
