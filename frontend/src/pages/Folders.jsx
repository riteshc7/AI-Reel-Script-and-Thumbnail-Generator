import { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit3, Trash2, X, Check, FileText, Hash } from 'lucide-react';
import { getFolders, createFolder, updateFolder, deleteFolder } from '../api/folders';
import { getScripts, duplicateScript, deleteScript } from '../api/scripts';
import ScriptCard from '../components/ScriptCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import useScrollReveal from '../hooks/useScrollReveal';

const FOLDER_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];

export default function Folders() {
  const [folders, setFolders] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(FOLDER_COLORS[0]);

  const headerRef = useScrollReveal();
  const foldersRef = useScrollReveal();
  const scriptsRef = useScrollReveal();

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [f, s] = await Promise.all([getFolders(), getScripts()]);
      setFolders(f);
      setScripts(s);
    } catch {
      toast.error('Failed to load folders');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return toast.error('Folder name required');
    try {
      const folder = await createFolder({ name: newName, color: newColor });
      setFolders((prev) => [...prev, folder]);
      setShowCreate(false);
      setNewName('');
      toast.success('Folder created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  }

  async function handleRename(id) {
    if (!editingFolder?.name?.trim()) return;
    try {
      const updated = await updateFolder(id, { name: editingFolder.name, color: editingFolder.color });
      setFolders((prev) => prev.map(f => f._id === id ? updated : f));
      setEditingFolder(null);
      toast.success('Folder renamed');
    } catch {
      toast.error('Failed to rename');
    }
  }

  async function handleDeleteFolder(id) {
    if (!confirm('Delete this folder? Scripts will be unassigned.')) return;
    try {
      await deleteFolder(id);
      setFolders((prev) => prev.filter(f => f._id !== id));
      if (selectedFolder === id) setSelectedFolder(null);
      loadData();
      toast.success('Folder deleted');
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function handleDuplicate(id) {
    try { await duplicateScript(id); toast.success('Script duplicated'); loadData(); }
    catch { toast.error('Failed to duplicate'); }
  }

  async function handleDeleteScript(id) {
    if (!confirm('Delete this script?')) return;
    try { await deleteScript(id); loadData(); toast.success('Script deleted'); }
    catch { toast.error('Failed to delete'); }
  }

  const filteredScripts = selectedFolder
    ? scripts.filter((s) => s.folder?._id === selectedFolder || s.folder === selectedFolder)
    : scripts;

  if (loading) return <LoadingSpinner size="lg" text="Loading folders..." />;

  return (
    <div className="space-y-8">
      <div ref={headerRef} className="reveal flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
            <FolderOpen className="text-brand-400" aria-hidden="true" />
            Folders
          </h1>
          <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Organize your scripts into projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} aria-hidden="true" /> New Folder
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Folder tabs">
        <button
          onClick={() => setSelectedFolder(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
            !selectedFolder ? 'bg-brand-600 text-white shadow-sm' : 'hover:opacity-80'
          }`}
          style={{ backgroundColor: !selectedFolder ? undefined : 'var(--color-surface-secondary)', color: !selectedFolder ? undefined : 'var(--color-text-secondary)' }}
          role="tab"
          aria-selected={!selectedFolder}
        >
          All Scripts
        </button>
        {folders.map((folder) => (
          <button
            key={folder._id}
            onClick={() => setSelectedFolder(folder._id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98] flex items-center gap-2 ${
              selectedFolder === folder._id ? 'bg-brand-600 text-white shadow-sm' : 'hover:opacity-80'
            }`}
            style={{ backgroundColor: selectedFolder === folder._id ? undefined : 'var(--color-surface-secondary)', color: selectedFolder === folder._id ? undefined : 'var(--color-text-secondary)' }}
            role="tab"
            aria-selected={selectedFolder === folder._id}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: folder.color }} aria-hidden="true" />
            {folder.name}
          </button>
        ))}
      </div>

      {showCreate && (
        <div className="card animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field flex-1"
              placeholder="Folder name..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              aria-label="New folder name"
            />
            <button onClick={handleCreate} className="btn-primary p-2.5" aria-label="Create folder"><Check size={18} /></button>
            <button onClick={() => setShowCreate(false)} className="btn-secondary p-2.5" aria-label="Cancel"><X size={18} /></button>
          </div>
          <div className="flex gap-2">
            {FOLDER_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                className={`w-7 h-7 rounded-full transition-all active:scale-90 ${newColor === color ? 'ring-2 ring-offset-2' : ''}`}
                style={{ backgroundColor: color, ringColor: newColor === color ? 'var(--color-text)' : undefined }}
                aria-label={`Color ${color}`}
                aria-pressed={newColor === color}
              />
            ))}
          </div>
        </div>
      )}

      {folders.length > 0 && (
        <div ref={foldersRef} className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const count = scripts.filter(s => s.folder?._id === folder._id || s.folder === folder._id).length;
            return (
              <div key={folder._id} className="card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: folder.color }} aria-hidden="true" />
                    {editingFolder?._id === folder._id ? (
                      <input
                        value={editingFolder.name}
                        onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                        className="input-field text-sm py-1"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(folder._id)}
                        aria-label="Folder name"
                      />
                    ) : (
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{folder.name}</h3>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {editingFolder?._id === folder._id ? (
                      <>
                        <button onClick={() => handleRename(folder._id)} className="p-1.5 rounded-lg hover:bg-surface-secondary transition-all" aria-label="Save"><Check size={14} className="text-green-400" /></button>
                        <button onClick={() => setEditingFolder(null)} className="p-1.5 rounded-lg hover:bg-surface-secondary transition-all" aria-label="Cancel"><X size={14} className="text-red-400" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditingFolder(folder)} className="p-1.5 rounded-lg hover:bg-surface-secondary transition-all" aria-label="Rename folder"><Edit3 size={14} style={{ color: 'var(--color-text-muted)' }} /></button>
                        <button onClick={() => handleDeleteFolder(folder._id)} className="p-1.5 rounded-lg hover:bg-red-600/10 transition-all" aria-label="Delete folder"><Trash2 size={14} className="text-red-400" /></button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {count} {count === 1 ? 'script' : 'scripts'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div ref={scriptsRef} className="reveal">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          {selectedFolder
            ? `Scripts in ${folders.find(f => f._id === selectedFolder)?.name || 'folder'}`
            : 'All Scripts'}
          <span className="text-sm ml-2" style={{ color: 'var(--color-text-muted)' }}>({filteredScripts.length})</span>
        </h2>
        {filteredScripts.length === 0 ? (
          <div className="card text-center py-12">
            <FileText size={40} className="mx-auto mb-3" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <p style={{ color: 'var(--color-text-secondary)' }}>No scripts here yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script._id}
                script={script}
                onDuplicate={handleDuplicate}
                onDelete={handleDeleteScript}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
