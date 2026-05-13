import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Copy, Trash2, Edit3, TrendingUp, Film, Image,
} from 'lucide-react';
import { getScript, updateScript, duplicateScript, deleteScript } from '../api/scripts';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ScriptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { loadScript(); }, [id]);

  async function loadScript() {
    try {
      const data = await getScript(id);
      setScript(data);
      setEditForm({
        title: data.title,
        hook: data.hook,
        script: data.script,
        cta: data.cta,
        caption: data.caption,
        hashtags: data.hashtags?.join(', ') || '',
      });
    } catch {
      toast.error('Script not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = {
        ...editForm,
        hashtags: editForm.hashtags.split(',').map(t => t.trim()).filter(Boolean),
      };
      const res = await updateScript(id, updated);
      setScript(res);
      setEditing(false);
      toast.success('Script updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicate() {
    try {
      const dup = await duplicateScript(id);
      toast.success('Script duplicated');
      navigate(`/scripts/${dup._id}`);
    } catch {
      toast.error('Failed to duplicate');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this script permanently?')) return;
    try {
      await deleteScript(id);
      toast.success('Script deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading script..." />;
  if (!script) return null;

  if (editing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditing(false)} className="btn-secondary p-2.5" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Edit Script</h1>
        </div>
        <div className="card space-y-4 max-w-3xl">
          {[
            { key: 'title', label: 'Title', type: 'input', rows: 1 },
            { key: 'hook', label: 'Hook', type: 'textarea', rows: 2 },
            { key: 'script', label: 'Script', type: 'textarea', rows: 8 },
            { key: 'cta', label: 'CTA', type: 'input', rows: 1 },
            { key: 'caption', label: 'Caption', type: 'textarea', rows: 4 },
          ].map(({ key, label, type, rows }) => (
            <div key={key}>
              <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
              {type === 'input' ? (
                <input
                  className="input-field"
                  value={editForm[key] || ''}
                  onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                />
              ) : (
                <textarea
                  className="input-field"
                  rows={rows}
                  value={editForm[key] || ''}
                  onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>Hashtags (comma separated)</label>
            <input className="input-field" value={editForm.hashtags} onChange={e => setEditForm(f => ({ ...f, hashtags: e.target.value }))} />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="btn-secondary p-2.5" aria-label="Back to dashboard">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{script.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span className="capitalize">{script.platform === 'youtube-shorts' ? 'Shorts' : script.platform}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{script.niche}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="capitalize">{script.style}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {script.viralScore !== null && (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-600/20 text-green-400 text-sm font-medium">
              <TrendingUp size={16} aria-hidden="true" /> {script.viralScore}/100
            </span>
          )}
          <button onClick={() => setEditing(true)} className="btn-secondary p-2.5" aria-label="Edit script"><Edit3 size={18} /></button>
          <button onClick={handleDuplicate} className="btn-secondary p-2.5" aria-label="Duplicate script"><Copy size={18} /></button>
          <button onClick={handleDelete} className="p-2.5 rounded-xl transition-all bg-red-600 hover:bg-red-700 text-white active:scale-[0.97]" aria-label="Delete script"><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>HOOK</p>
            <p className="text-lg font-medium text-brand-400">{script.hook}</p>
          </div>

          <div className="card">
            <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-muted)' }}>SCRIPT</p>
            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{script.script}</p>
          </div>

          {script.scenes?.length > 0 && (
            <div className="card">
              <p className="text-xs font-medium mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <Film size={14} aria-hidden="true" /> SCENE BREAKDOWN
              </p>
              <div className="space-y-3">
                {script.scenes.map((scene, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-brand-400 font-semibold">Scene {scene.sceneNumber || i + 1}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{scene.duration}</span>
                    </div>
                    {scene.visual && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Visual:</span> {scene.visual}</p>}
                    {scene.audio && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Audio:</span> {scene.audio}</p>}
                    {scene.text && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Text:</span> {scene.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {script.cta && (
            <div className="card" style={{ borderColor: 'rgba(34,197,94,0.2)', backgroundColor: 'rgba(34,197,94,0.05)' }}>
              <p className="text-xs text-green-400 font-medium mb-2">CTA</p>
              <p style={{ color: 'var(--color-text)' }}>{script.cta}</p>
            </div>
          )}

          {script.caption && (
            <div className="card">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>CAPTION</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{script.caption}</p>
            </div>
          )}

          {script.hashtags?.length > 0 && (
            <div className="card">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>HASHTAGS</p>
              <div className="flex flex-wrap gap-1.5">
                {script.hashtags.map((tag, i) => (
                  <span key={i} className="text-sm px-2.5 py-1 rounded-lg" style={{ color: '#818cf8', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            to={`/thumbnails?script=${script._id}&topic=${encodeURIComponent(script.topic)}`}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Image size={18} aria-hidden="true" /> Generate Thumbnail
          </Link>
        </div>
      </div>
    </div>
  );
}
