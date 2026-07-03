// A dynamic, moving watermark overlay. Doesn't PREVENT screen recording
// (nothing on the web can), but makes any leak traceable to the exact user.
export default function Watermark({ text }) {
  if (!text) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[60] overflow-hidden select-none">
      {/* faint tiled layer */}
      <div className="absolute inset-0 flex rotate-[-20deg] scale-150 flex-wrap content-start gap-x-16 gap-y-16 opacity-[0.08]">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="whitespace-nowrap text-xs text-white">
            {text}
          </span>
        ))}
      </div>

      {/* moving label */}
      <span className="wm-move absolute whitespace-nowrap text-sm font-medium text-white/40">
        {text}
      </span>

      <style>{`
        @keyframes wmMove {
          0%   { top: 8%;  left: 6%;  }
          20%  { top: 68%; left: 62%; }
          40%  { top: 35%; left: 18%; }
          60%  { top: 82%; left: 38%; }
          80%  { top: 20%; left: 70%; }
          100% { top: 8%;  left: 6%;  }
        }
        .wm-move { animation: wmMove 14s linear infinite; }
      `}</style>
    </div>
  );
}
