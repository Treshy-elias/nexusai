export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-cyan-400">N</span>
      </div>
      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3">
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
      </div>
    </div>
  )
}