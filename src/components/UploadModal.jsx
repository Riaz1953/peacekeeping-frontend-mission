"use client";
import React, { useState, useEffect } from "react";
import { getMissionsAndUnits, uploadMedia } from "@/utils/api";
import toast from "react-hot-toast";
import MissionUnitModal from "./MissionUnitModal";

const categoriesList = [
  "ops",
  "logistic",
  "medical",
  "ndromo pob",
  "bayoo tob",
];

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [missionUnitsMap, setMissionUnitsMap] = useState({
    MONUSCO: ["BANRDB", "BANENGR", "BANLOG", "BANMED", "BANAMU"],
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyPerson: "",
    mission: "MONUSCO",
    unit: "BANRDB",
    category: "ops",
    date: new Date().toISOString().split("T")[0],
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [descWordCount, setDescWordCount] = useState(0);
  const [isManageOpen, setIsManageOpen] = useState(false);

  const fetchConfig = () => {
    getMissionsAndUnits()
      .then((res) => {
        if (res.data?.data) {
          setMissionUnitsMap(res.data.data);
          const missions = Object.keys(res.data.data);
          if (missions.length > 0 && !missions.includes(formData.mission)) {
            setFormData((prev) => ({
              ...prev,
              mission: missions[0],
              unit: res.data.data[missions[0]][0] || "",
            }));
          }
        }
      })
      .catch((err) => console.error("Failed to load config:", err));
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const availableUnits = missionUnitsMap[formData.mission] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      const words = value.trim() === "" ? [] : value.trim().split(/\s+/);
      if (words.length > 50) return;
      setDescWordCount(words.length);
    }
    if (name === "mission") {
      const units = missionUnitsMap[value] || [];
      setFormData({ ...formData, mission: value, unit: units[0] || "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!file) {
      toast.error("Please select a media file");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("file", file);

    try {
      setLoading(true);
      toast.loading("Uploading media...", { id: "upload" });
      await uploadMedia(data);
      toast.success("Media uploaded successfully!", { id: "upload" });
      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to upload media", { id: "upload" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl my-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                Upload New Media
              </h2>
              <button
                type="button"
                onClick={() => setIsManageOpen(true)}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer"
              >
                ⚙️ Manage Missions/Units
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-100 text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Key Person / Senior Officer
              </label>
              <input
                type="text"
                name="keyPerson"
                value={formData.keyPerson}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Description (Max 50 words)
                </label>
                <span
                  className={`text-[10px] ${descWordCount >= 50 ? "text-rose-400 font-bold" : "text-slate-400"}`}
                >
                  {descWordCount}/50 words
                </span>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mission *
                </label>
                <select
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase cursor-pointer"
                >
                  {Object.keys(missionUnitsMap).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase cursor-pointer"
                >
                  {availableUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 cursor-pointer"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Media File *
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                required
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white cursor-pointer"
              />
              {file && (
                <span className="text-[11px] text-green-400 mt-1 block">
                  Selected: {file.name}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload Media"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isManageOpen && (
        <MissionUnitModal
          missionUnitsMap={missionUnitsMap}
          onClose={() => setIsManageOpen(false)}
          onSuccess={fetchConfig}
        />
      )}
    </>
  );
}
