"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import EditModal from "./EditModal";
import MediaDetailsModal from "./MediaDetailsModal";

export default function MediaCard({ media, onLikeUpdate, onDelete }) {
  const CURRENT_USER_ID = "guest_user";
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(media?.likesCount || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const menuRef = useRef(null);

  // Helper function to convert .mov and other video extensions to playable format
  const getPlayableVideoUrl = (url) => {
    if (!url) return "";
    return url.replace(/\.[^/.]+$/, ".mp4");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (media?.likedBy && Array.isArray(media.likedBy)) {
      setLiked(media.likedBy.includes(CURRENT_USER_ID));
    }
    if (typeof media?.likesCount === "number") {
      setLikesCount(media.likesCount);
    }
  }, [media]);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevLikesCount = likesCount;
    const newLiked = !liked;
    const newLikesCount = newLiked
      ? likesCount + 1
      : Math.max(0, likesCount - 1);

    setLiked(newLiked);
    setLikesCount(newLikesCount);

    try {
      const response = await axios.patch(
        `https://peacekeeping-backend-mission.onrender.com/api/v1/media/${media._id}/like`,
        { userId: CURRENT_USER_ID },
        { withCredentials: true },
      );
      if (response.data?.data) {
        setLiked(response.data.data.isLiked);
        setLikesCount(response.data.data.likesCount);
      }
      if (onLikeUpdate) onLikeUpdate();
    } catch (error) {
      setLiked(prevLiked);
      setLikesCount(prevLikesCount);
      toast.error("Failed to update like status");
    }
  };

  const handleDownload = async () => {
    try {
      toast.loading("Preparing download...", { id: "download" });
      const response = await fetch(media.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = media.title
        ? `${media.title}.${media.mediaType === "video" ? "mp4" : "jpg"}`
        : "media-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download started!", { id: "download" });
    } catch (error) {
      toast.error("Download failed", { id: "download" });
      window.open(media.url, "_blank");
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting media...", { id: "delete-toast" });
      await axios.delete(`http://localhost:5000/api/v1/media/${media._id}`);
      toast.success("Media deleted successfully", { id: "delete-toast" });
      if (onDelete) onDelete(media._id);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete media", { id: "delete-toast" });
    }
  };

  const getShortDescription = (text) => {
    if (!text) return "No description.";
    const words = text.split(" ");
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(" ") + "...";
  };

  const formattedDate = media.date
    ? new Date(media.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-500/50 group">
        {/* Click korle Details Modal open hobe ebong video/image dekhabe */}
        <div
          onClick={() => setIsDetailsOpen(true)}
          className="h-48 w-full bg-slate-950 relative overflow-hidden cursor-pointer flex items-center justify-center"
        >
          {media.mediaType === "video" ? (
            <>
              <video
                src={getPlayableVideoUrl(media.url)}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-all">
                <span className="bg-blue-600/90 text-white rounded-full p-3 shadow-lg text-sm">
                  ▶️
                </span>
              </div>
            </>
          ) : (
            <Image
              src={media.url}
              alt={media.title || "Media"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <span className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-xs px-2.5 py-1 rounded-lg text-slate-200 font-medium uppercase">
            {media.mission} ({media.unit})
          </span>

          <div
            className="absolute top-2 right-2 z-20 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleLike}
              className={`backdrop-blur-md px-3 py-1.5 rounded-full text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                liked
                  ? "bg-rose-600/90 hover:bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "bg-black/60 hover:bg-black/80"
              }`}
            >
              <span>{liked ? "❤️" : "🤍"}</span>
              <span>{likesCount}</span>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-black/60 hover:bg-black/80 text-white h-8 w-8 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center justify-center font-bold text-sm"
              >
                ⋮
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-30">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsEditOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleDelete();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-100 truncate flex-1">
                {media.title}
              </h3>
              <span className="text-[11px] font-medium text-blue-400 whitespace-nowrap bg-blue-950/40 px-2 py-0.5 rounded-md">
                {formattedDate}
              </span>
            </div>

            {media.keyPerson && (
              <p className="text-[11px] text-blue-400 font-medium truncate mt-0.5">
                Key Person: {media.keyPerson}
              </p>
            )}

            <p className="text-xs text-slate-400 line-clamp-1 mt-1">
              {getShortDescription(media.description)}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <span className="bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-semibold">
              {media.category}
            </span>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
            >
              📥 Download
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditModal
          media={media}
          onClose={() => setIsEditOpen(false)}
          onUpdateSuccess={onLikeUpdate}
        />
      )}

      {/* Full Details Modal */}
      {isDetailsOpen && (
        <MediaDetailsModal
          media={media}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
}
