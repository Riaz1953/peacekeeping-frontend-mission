"use client";
import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import MediaGrid from "@/components/MediaGrid";
import UploadModal from "@/components/UploadModal";
import BlurLoader from "@/components/BlurLoader";

export default function Home() {
  const CURRENT_USER_ID = "guest_user";
  const [selectedMission, setSelectedMission] = useState("MONUSCO");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleResetHome = () => {
    setSelectedMission("MONUSCO");
    setSelectedUnit("");
    setMediaType("all");
    setSearchTerm("");
    setSelectedDate("");
    setShowLikedOnly(false);
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        mission: selectedMission,
        ...(selectedUnit && { unit: selectedUnit }),
        ...(mediaType !== "all" && { mediaType }),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDate && { date: selectedDate }),
      });

      const response = await api.get(`/media?${queryParams}`);
      if (response.data?.data) {
        setMediaList(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
      setError(
        "Server-er sathe connect korte somossa hocche. Doya kore ektu por abar chesta korun.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedMission, selectedUnit, mediaType, searchTerm, selectedDate]);

  const displayedMedia = showLikedOnly
    ? mediaList.filter(
        (item) => item.likedBy && item.likedBy.includes(CURRENT_USER_ID),
      )
    : mediaList;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        selectedMission={selectedMission}
        setSelectedMission={setSelectedMission}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLogoClick={handleResetHome}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        <HeroSearch
          mediaType={mediaType}
          setMediaType={setMediaType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onSearch={(params) => {
            setSearchTerm(params.searchTerm);
            setSelectedDate(params.selectedDate);
          }}
          showLikedOnly={showLikedOnly}
          setShowLikedOnly={setShowLikedOnly}
        />

        {error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center p-6">
            <p className="text-rose-400 text-sm font-medium">{error}</p>
            <button
              onClick={fetchMedia}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative min-h-[350px] w-full">
            {loading && <BlurLoader text="LOADING MEDIA..." />}

            <MediaGrid
              mediaList={displayedMedia}
              onLikeUpdate={fetchMedia}
              setMediaList={setMediaList}
            />
          </div>
        )}
      </div>

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={fetchMedia}
        />
      )}
    </main>
  );
}
