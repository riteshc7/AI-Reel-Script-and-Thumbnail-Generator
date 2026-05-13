export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-label={text || 'Loading'}>
      <div className={`relative ${sizes[size] || sizes.md}`}>
        <div className={`absolute inset-0 rounded-full border-2 opacity-20`} style={{ borderColor: 'var(--color-border)' }} />
        <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin`} />
      </div>
      {text && <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{text}</p>}
    </div>
  );
}
