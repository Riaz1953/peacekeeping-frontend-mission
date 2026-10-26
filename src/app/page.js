"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import MediaGrid from "@/components/MediaGrid";
import UploadModal from "@/components/UploadModal";

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
      const queryParams = new URLSearchParams({
        mission: selectedMission,
        ...(selectedUnit && { unit: selectedUnit }),
        ...(mediaType !== "all" && { mediaType }),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedDate && { date: selectedDate }),
      });

      const response = await axios.get(
        `https://peacekeeping-backend-mission.onrender.com/api/v1/media?${queryParams}`,
      );
      if (response.data?.data) {
        setMediaList(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch media:", error);
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
        <MediaGrid
          mediaList={displayedMedia}
          onLikeUpdate={fetchMedia}
          setMediaList={setMediaList}
        />
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
