import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Sparkles, Hash, Target, Film, Palette, Wand2, Save, Loader2, Check,
} from 'lucide-react';
import { generateScript, saveScript } from '../api/scripts';
import { PLATFORMS, NICHES, STYLES } from '../utils/helpers';
import toast from 'react-hot-toast';
import useScrollReveal from '../hooks/useScrollReveal';

function StepIndicator({ steps, active }) {
  return (
    <nav className="flex items-center gap-2 mb-6" aria-label="Generation steps">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              i <= active
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'opacity-40'
            }`}
            style={{ backgroundColor: i <= active ? undefined : 'var(--color-surface-secondary)', color: i <= active ? undefined : 'var(--color-text-muted)' }}
            aria-current={i === active ? 'step' : undefined}
          >
            {i < active ? <Check size={14} /> : i + 1}
          </div>
          <span className={`text-sm hidden sm:inline transition-colors ${i <= active ? '' : 'opacity-40'}`}
            style={{ color: i <= active ? 'var(--color-text)' : 'var(--color-text-muted)' }}
          >
            {step}
          </span>
          {i < 2 && (
            <div className={`w-10 h-0.5 rounded transition-all duration-300 ${i < active ? 'bg-brand-500' : ''}`}
              style={{ backgroundColor: i < active ? undefined : 'var(--color-border)' }}
            />
          )}
        </div>
      ))}
    </nav>
  );
}

function InputGroup({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
        <Icon size={16} className="text-brand-400" aria-hidden="true" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ScriptGenerator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ topic: '', niche: '', platform: '', style: '' });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const formRef = useScrollReveal();
  const previewRef = useScrollReveal();

  const steps = ['Topic & Niche', 'Platform & Style', 'Review & Generate'];

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
    if (activeStep === 0 && (!form.topic || !form.niche)) {
      toast.error('Please enter topic and niche');
      return;
    }
    if (activeStep === 1 && (!form.platform || !form.style)) {
      toast.error('Please select platform and style');
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, 2));
  }

  function prevStep() {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleGenerate() {
    setGenerating(true);
    setResult(null);
    try {
      const data = await generateScript(form);
      setResult(data);
      toast.success('Script generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed. Check your API key.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const saved = await saveScript(result);
      toast.success('Script saved!');
      navigate(`/scripts/${saved._id}`);
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
          <Wand2 className="text-brand-400" aria-hidden="true" />
          Script Generator
        </h1>
        <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>Generate viral short-form video scripts with AI</p>
      </div>

      <StepIndicator steps={steps} active={activeStep} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div ref={formRef} className="reveal card space-y-6">
          {activeStep === 0 && (
            <div className="space-y-5 animate-fade-in" key="step0">
              <InputGroup icon={Target} label="Topic">
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => updateForm('topic', e.target.value)}
                  className="input-field"
                  placeholder="e.g. 10 minute morning routine"
                  autoFocus
                />
              </InputGroup>
              <InputGroup icon={Hash} label="Niche / Category">
                <select
                  value={form.niche}
                  onChange={(e) => updateForm('niche', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select niche...</option>
                  {NICHES.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </InputGroup>
              <div className="flex gap-3 pt-4">
                <button onClick={nextStep} className="btn-primary flex-1">Next</button>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-5 animate-fade-in" key="step1">
              <InputGroup icon={Film} label="Platform">
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => updateForm('platform', p.value)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${
                        form.platform === p.value
                          ? 'border-brand-500 bg-brand-600/20 text-brand-400 shadow-sm'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        borderColor: form.platform === p.value ? undefined : 'var(--color-border)',
                        backgroundColor: form.platform === p.value ? undefined : 'var(--color-surface-secondary)',
                        color: form.platform === p.value ? undefined : 'var(--color-text-secondary)',
                      }}
                      aria-pressed={form.platform === p.value}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </InputGroup>
              <InputGroup icon={Palette} label="Content Style">
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateForm('style', s.toLowerCase())}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${
                        form.style === s.toLowerCase()
                          ? 'border-brand-500 bg-brand-600/20 text-brand-400 shadow-sm'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        borderColor: form.style === s.toLowerCase() ? undefined : 'var(--color-border)',
                        backgroundColor: form.style === s.toLowerCase() ? undefined : 'var(--color-surface-secondary)',
                        color: form.style === s.toLowerCase() ? undefined : 'var(--color-text-secondary)',
                      }}
                      aria-pressed={form.style === s.toLowerCase()}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </InputGroup>
              <div className="flex gap-3 pt-4">
                <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
                <button onClick={nextStep} className="btn-primary flex-1">Next</button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-5 animate-fade-in" key="step2">
              <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
                {[
                  { label: 'Topic', value: form.topic },
                  { label: 'Niche', value: form.niche },
                  { label: 'Platform', value: form.platform },
                  { label: 'Style', value: form.style },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-text-muted)' }}>{f.label}</span>
                    <span className="font-medium capitalize">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={prevStep} className="btn-secondary flex-1">Back</button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <><Loader2 size={18} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles size={18} /> Generate Script</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div ref={previewRef} className="reveal card space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap size={18} className="text-brand-400" aria-hidden="true" />
            {result ? 'Generated Script' : 'Preview'}
          </h2>

          {!result && !generating && (
            <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
              <Sparkles size={48} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>Fill in the details and generate your script</p>
            </div>
          )}

          {generating && (
            <div className="text-center py-16 animate-fade-in">
              <div className="relative h-12 w-12 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: 'var(--color-border)' }} />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>Generating viral script...</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Creating hook, scenes, hashtags & more</p>
            </div>
          )}

          {result && (
            <div className="space-y-5 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide animate-fade-in">
              <h3 className="text-xl font-bold text-brand-400">{result.title}</h3>

              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <p className="text-xs text-brand-400 font-medium mb-1">HOOK</p>
                <p style={{ color: 'var(--color-text)' }}>{result.hook}</p>
              </div>

              {result.viralScore !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: 'var(--color-text-muted)' }}>Viral Score:</span>
                  <span className="text-green-400 font-bold">{result.viralScore}/100</span>
                </div>
              )}

              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>SCRIPT</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{result.script}</p>
              </div>

              {result.scenes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}>
                    <Film size={12} aria-hidden="true" /> SCENE BREAKDOWN
                  </p>
                  <div className="space-y-2">
                    {result.scenes.map((scene, i) => (
                      <div key={i} className="rounded-xl p-3 text-sm" style={{ backgroundColor: 'var(--color-surface-secondary)', border: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-brand-400 font-medium">Scene {scene.sceneNumber || i + 1}</span>
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{scene.duration}</span>
                        </div>
                        {scene.visual && <p style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Visual:</span> {scene.visual}</p>}
                        {scene.audio && <p style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Audio:</span> {scene.audio}</p>}
                        {scene.text && <p style={{ color: 'var(--color-text-secondary)' }}><span style={{ color: 'var(--color-text-muted)' }}>Text:</span> {scene.text}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.cta && (
                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p className="text-xs text-green-400 font-medium mb-1">CTA</p>
                  <p style={{ color: 'var(--color-text)' }}>{result.cta}</p>
                </div>
              )}

              {result.caption && (
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>CAPTION</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{result.caption}</p>
                </div>
              )}

              {result.hashtags?.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>HASHTAGS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtags.map((tag, i) => (
                      <span key={i} className="text-sm px-2.5 py-1 rounded-lg" style={{ color: '#818cf8', backgroundColor: 'rgba(99,102,241,0.1)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Save size={18} aria-hidden="true" />
                {saving ? 'Saving...' : 'Save Script'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
