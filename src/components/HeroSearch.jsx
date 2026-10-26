"use client";
import React from "react";

export default function HeroSearch({
  mediaType,
  setMediaType,
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  onSearch,
  showLikedOnly,
  setShowLikedOnly,
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, selectedDate });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMediaType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mediaType === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setMediaType("image")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mediaType === "image"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => setMediaType("video")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mediaType === "video"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Video
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowLikedOnly(!showLikedOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            showLikedOnly
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
          }`}
        >
          <span>{showLikedOnly ? "❤️" : "🤍"}</span>
          <span>Liked Items</span>
        </button>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap md:flex-nowrap items-center gap-3 shadow-xl"
      >
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl">
          <span className="text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by title, programme, category, or key person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-200 focus:outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
