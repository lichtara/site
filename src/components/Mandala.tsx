export default function Mandala() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto">
      <defs>
        <style>{`.ring{fill:none;stroke:#e5e7eb;stroke-width:2}`}</style>
      </defs>
      <circle className="ring" cx="200" cy="200" r="60" />
      <circle className="ring" cx="200" cy="200" r="100" />
      <circle className="ring" cx="200" cy="200" r="140" />
      <circle className="ring" cx="200" cy="200" r="180" />
      <circle cx="200" cy="200" r="18" fill="#d4a017" />
      {/* pontos (exemplo) */}
      <circle cx="200" cy="120" r="10" fill="#1f2937" />
      <circle cx="120" cy="200" r="10" fill="#a21caf" />
      <circle cx="280" cy="200" r="10" fill="#0ea5e9" />
      <circle cx="200" cy="280" r="10" fill="#ef4444" />
    </svg>
  );
}
