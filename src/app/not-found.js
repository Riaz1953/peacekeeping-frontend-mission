import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-extrabold text-blue-500 mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
}
