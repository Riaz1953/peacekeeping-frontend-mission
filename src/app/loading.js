export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      <p className="text-slate-200 text-sm font-semibold tracking-wider animate-pulse">
        LOADING PEACEVAULT...
      </p>
    </div>
  );
}
