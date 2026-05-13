import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Hash, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { getTrendingTopics, getScriptIdeas } from '../api/scripts';
import { NICHES, PLATFORMS } from '../utils/helpers';
import toast from 'react-hot-toast';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Ideas() {
  const navigate = useNavigate();
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [scriptIdeas, setScriptIdeas] = useState([]);

  const controlsRef = useScrollReveal();
  const trendingRef = useScrollReveal();
  const ideasRef = useScrollReveal();

  async function fetchTrending() {
    if (!niche) return toast.error('Select a niche first');
    setLoadingTrending(true);
    try {
      const data = await getTrendingTopics(niche);
      setTrendingTopics(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch trending topics');
    } finally {
      setLoadingTrending(false);
    }
  }

  async function fetchIdeas() {
    if (!niche) return toast.error('Select a niche first');
    setLoadingIdeas(true);
    try {
      const data = await getScriptIdeas(niche, platform);
      setScriptIdeas(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to fetch ideas');
    } finally {
      setLoadingIdeas(false);
    }
  }

  function useTopic(topic) {
    navigate(`/generate?topic=${encodeURIComponent(topic)}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
          <Lightbulb className="text-yellow-400" aria-hidden="true" />
          Content Ideas
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Discover trending topics and get inspired</p>
      </div>

      <div ref={controlsRef} className="reveal card space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="ideas-niche" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Niche
            </label>
            <select
              id="ideas-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="input-field"
            >
              <option value="">Select niche...</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="ideas-platform" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Platform
            </label>
            <select
              id="ideas-platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="input-field"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchTrending}
            disabled={loadingTrending}
            className="btn-primary flex items-center gap-2"
          >
            {loadingTrending ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
            Trending Topics
          </button>
          <button
            onClick={fetchIdeas}
            disabled={loadingIdeas}
            className="btn-secondary flex items-center gap-2"
          >
            {loadingIdeas ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Get Ideas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {trendingTopics.length > 0 && (
          <div ref={trendingRef} className="reveal card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-green-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Trending Topics in {niche}</h2>
            </div>
            <div className="space-y-2">
              {trendingTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => useTopic(topic)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80 active:scale-[0.99] group"
                  style={{ backgroundColor: 'var(--color-surface-secondary)' }}
                >
                  <span className="w-7 h-7 rounded-lg bg-brand-600/20 text-brand-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm transition-colors group-hover:text-brand-400" style={{ color: 'var(--color-text-secondary)' }}>
                    {topic}
                  </span>
                  <span className="text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Generate &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {scriptIdeas.length > 0 && (
          <div ref={ideasRef} className="reveal card">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-yellow-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Script Ideas for {niche}</h2>
            </div>
            <div className="space-y-2">
              {scriptIdeas.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => useTopic(idea)}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all hover:opacity-80 active:scale-[0.99] group"
                  style={{ backgroundColor: 'var(--color-surface-secondary)' }}
                >
                  <span className="w-7 h-7 rounded-lg bg-yellow-600/20 text-yellow-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm transition-colors group-hover:text-yellow-400" style={{ color: 'var(--color-text-secondary)' }}>
                    {idea}
                  </span>
                  <span className="text-xs text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Generate &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {trendingTopics.length === 0 && scriptIdeas.length === 0 && (
          <div className="lg:col-span-2 card text-center py-16">
            <Lightbulb size={48} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Select a niche and click &ldquo;Trending Topics&rdquo; or &ldquo;Get Ideas&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
