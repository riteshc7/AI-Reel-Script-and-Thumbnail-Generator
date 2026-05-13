import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Image, TrendingUp, Plus, Zap, Search, ArrowUpDown, Sparkles } from 'lucide-react';
import { getScripts } from '../api/scripts';
import { getThumbnails } from '../api/thumbnails';
import { duplicateScript, deleteScript } from '../api/scripts';
import { deleteThumbnail } from '../api/thumbnails';
import ScriptCard from '../components/ScriptCard';
import { DashboardSkeleton } from '../components/SkeletonCard';
import toast from 'react-hot-toast';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Dashboard() {
  const [scripts, setScripts] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stats, setStats] = useState({ totalScripts: 0, totalThumbnails: 0, avgViralScore: 0 });

  const headerRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const scriptsRef = useScrollReveal();
  const thumbsRef = useScrollReveal();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [scriptsData, thumbnailsData] = await Promise.all([getScripts(), getThumbnails()]);
      setScripts(scriptsData);
      setThumbnails(thumbnailsData);
      const scores = scriptsData.filter(s => s.viralScore != null).map(s => s.viralScore);
      setStats({
        totalScripts: scriptsData.length,
        totalThumbnails: thumbnailsData.length,
        avgViralScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      });
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleDuplicate(id) {
    try { await duplicateScript(id); toast.success('Script duplicated'); loadData(); }
    catch { toast.error('Failed to duplicate'); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this script?')) return;
    try { await deleteScript(id); toast.success('Script deleted'); loadData(); }
    catch { toast.error('Failed to delete'); }
  }

  async function handleDeleteThumbnail(id) {
    try { await deleteThumbnail(id); toast.success('Thumbnail deleted'); loadData(); }
    catch { toast.error('Failed to delete'); }
  }

  const filteredScripts = useMemo(() => {
    let list = [...scripts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.niche?.toLowerCase().includes(q) ||
        s.hook?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'oldest': list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'score': list.sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0)); break;
      default: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [scripts, search, sortBy]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div ref={headerRef} className="reveal flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Your content at a glance</p>
        </div>
        <Link to="/generate" className="btn-primary flex items-center gap-2">
          <Zap size={18} aria-hidden="true" />
          New Script
        </Link>
      </div>

      <div ref={statsRef} className="reveal grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: FileText, color: 'bg-brand-600/20', iconColor: 'text-brand-400', label: 'Total Scripts', value: stats.totalScripts },
          { icon: Image, color: 'bg-purple-600/20', iconColor: 'text-purple-400', label: 'Thumbnails Generated', value: stats.totalThumbnails },
          { icon: TrendingUp, color: 'bg-green-600/20', iconColor: 'text-green-400', label: 'Avg Viral Score', value: stats.avgViralScore || '\u2014' },
        ].map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon size={20} className={stat.iconColor} aria-hidden="true" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div ref={scriptsRef} className="reveal">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles size={20} className="text-brand-400" aria-hidden="true" />
            Scripts
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 py-2 text-sm w-48 lg:w-64"
                placeholder="Search scripts..."
                aria-label="Search scripts"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2 text-sm w-36"
              aria-label="Sort scripts"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="score">Viral Score</option>
            </select>
          </div>
        </div>

        {filteredScripts.length === 0 ? (
          <div className="card text-center py-12">
            <FileText size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {search ? 'No scripts match your search' : 'No scripts yet. Generate your first one!'}
            </p>
            {!search && (
              <Link to="/generate" className="btn-primary inline-flex items-center gap-2 mt-4">
                <Plus size={18} aria-hidden="true" /> Generate Script
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScripts.slice(0, 6).map((script) => (
              <ScriptCard key={script._id} script={script} onDuplicate={handleDuplicate} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {thumbnails.length > 0 && (
        <div ref={thumbsRef} className="reveal">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Image size={20} className="text-purple-400" aria-hidden="true" />
            Recent Thumbnails
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {thumbnails.slice(0, 4).map((thumb) => (
              <div key={thumb._id} className="card-hover">
                {thumb.imageData && (
                  <img src={thumb.imageData} alt="" className="w-full aspect-video object-cover rounded-xl mb-2" loading="lazy" />
                )}
                <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{thumb.prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
