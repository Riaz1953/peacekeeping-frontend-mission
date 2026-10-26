"use client";
import React from "react";
import MediaCard from "./MediaCard";

export default function MediaGrid({ mediaList, onLikeUpdate, setMediaList }) {
  if (!mediaList || mediaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="text-lg font-medium">No media items found.</p>
        <p className="text-xs text-slate-500 mt-1">
          Try changing your filters or upload a new media.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mediaList.map((media) => (
        <MediaCard
          key={media._id}
          media={media}
          onLikeUpdate={onLikeUpdate}
          onDelete={(deletedId) => {
            if (setMediaList) {
              setMediaList((prevList) =>
                prevList.filter((item) => item._id !== deletedId),
              );
            }
          }}
        />
      ))}
    </div>
  );
}
