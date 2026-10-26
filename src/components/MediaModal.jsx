"use client";
// Icon imports for Details Modal
import { FiX, FiDownload, FiCalendar, FiTag, FiFolder } from "react-icons/fi";

export default function MediaModal({ media, onClose }) {
  // Modal open thakar jonno data na thakle kichu render korbe na
  if (!media) return null;

  return (
    // Modal Overlay Dark Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-base-100 rounded-2xl overflow-hidden shadow-2xl border border-base-300 max-h-[90vh] flex flex-col md:flex-row">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 btn btn-circle btn-sm btn-neutral text-white"
        >
          <FiX className="text-lg" />
        </button>

        {/* Media Preview Box (Left/Top) */}
        <div className="w-full md:w-2/3 bg-black/90 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          {media.mediaType === "image" ? (
            <img
              src={media.url}
              alt={media.title}
              className="max-h-[80vh] w-auto object-contain"
            />
          ) : (
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full max-h-[80vh] object-contain"
            />
          )}
        </div>

        {/* Information Sidebar (Right/Bottom) */}
        <div className="w-full md:w-1/3 p-6 flex flex-col justify-between overflow-y-auto bg-base-100">
          <div className="space-y-4">
            <div>
              <span className="badge badge-primary text-xs font-bold uppercase mb-2">
                {media.mediaType}
              </span>
              <h2 className="text-2xl font-bold text-base-content leading-tight">
                {media.title}
              </h2>
              <p className="text-sm text-base-content/70 mt-2">
                {media.description || "No description provided."}
              </p>
            </div>

            <div className="divider my-2"></div>

            {/* Detailed Meta Tags */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-base-content/80">
                <FiFolder className="text-primary text-lg" />
                <div>
                  <span className="font-semibold block text-xs uppercase text-gray-400">
                    Mission & Unit
                  </span>
                  <span>
                    {media.mission} — {media.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-base-content/80">
                <FiTag className="text-primary text-lg" />
                <div>
                  <span className="font-semibold block text-xs uppercase text-gray-400">
                    Category
                  </span>
                  <span className="capitalize">{media.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-base-content/80">
                <FiCalendar className="text-primary text-lg" />
                <div>
                  <span className="font-semibold block text-xs uppercase text-gray-400">
                    Programme & Date
                  </span>
                  <span>
                    {media.programName} (
                    {new Date(media.date).toLocaleDateString()})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Action Footer Button */}
          <div className="pt-6 mt-4 border-t border-base-200">
            <a
              href={media.url}
              download
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-full rounded-xl gap-2 shadow-lg"
            >
              <FiDownload className="text-lg" />
              <span>Download High Res {media.mediaType}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
