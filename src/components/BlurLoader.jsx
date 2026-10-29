export default function BlurLoader({ text = "Loading..." }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md rounded-2xl transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
        {/* Inner spinning loader */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-300 text-xs font-semibold tracking-wider mt-3 animate-pulse">
        {text}
      </p>
    </div>
  );
}
