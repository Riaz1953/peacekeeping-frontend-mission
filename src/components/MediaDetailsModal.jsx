"use client";
import React from "react";
import Image from "next/image";

export default function MediaDetailsModal({ media, onClose }) {
  if (!media) return null;

  // Helper function to convert .mov and other video extensions to playable format
  const getPlayableVideoUrl = (url) => {
    if (!url) return "";
    return url.replace(/\.[^/.]+$/, ".mp4");
  };

  const formattedDate = media.date
    ? new Date(media.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100 truncate">
            {media.title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="relative w-full h-72 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
            {media.mediaType === "video" ? (
              <video
                src={getPlayableVideoUrl(media.url)}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                src={media.url}
                alt={media.title}
                fill
                className="object-contain"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span className="bg-blue-950/60 text-blue-400 px-2.5 py-1 rounded-lg font-semibold uppercase">
              {media.mission} ({media.unit})
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-semibold uppercase">
              Category: {media.category}
            </span>
            <span className="font-medium text-slate-300">
              📅 {formattedDate}
            </span>
          </div>

          {/* Key Person Details */}
          {media.keyPerson && (
            <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl text-xs text-slate-300">
              <span className="text-blue-400 font-semibold">
                👤 Key Person / Senior Officer:
              </span>{" "}
              {media.keyPerson}
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {media.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
