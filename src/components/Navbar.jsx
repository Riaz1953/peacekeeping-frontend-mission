"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar({
  selectedMission,
  setSelectedMission,
  selectedUnit,
  setSelectedUnit,
  onOpenUpload,
  onLogoClick,
}) {
  const [missionUnitsMap, setMissionUnitsMap] = useState({
    MONUSCO: ["BANRDB", "BANENGR", "BANLOG", "BANMED", "BANAMU"],
    UNMISS: ["BANRDB", "BANENGR", "BANLOG", "BANMED"],
  });

  useEffect(() => {
    axios
      .get(
        "https://peacekeeping-backend-mission.onrender.com/api/v1/media/config/missions-units",
      )
      .then((res) => {
        if (res.data?.data && Object.keys(res.data.data).length > 0) {
          setMissionUnitsMap(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to load navbar config:", err));
  }, []);

  const missions = Object.keys(missionUnitsMap);
  const currentUnits = missionUnitsMap[selectedMission] || [];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-md">
      <div
        onClick={onLogoClick ? onLogoClick : () => window.location.reload()}
        className="text-lg font-extrabold tracking-wider text-slate-100 flex items-center gap-2 cursor-pointer"
      >
        🌍 <span className="text-blue-500">PEACEVAULT</span>
      </div>

      {/* Mission Selector Dropdown */}
      <div className="flex items-center gap-3">
        <select
          value={selectedMission}
          onChange={(e) => {
            setSelectedMission(e.target.value);
            setSelectedUnit("");
          }}
          className="bg-slate-950 border border-slate-800 text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer uppercase"
        >
          {missions.map((mission) => (
            <option key={mission} value={mission}>
              {mission}
            </option>
          ))}
        </select>
      </div>

      {/* Unit Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedUnit("")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedUnit === ""
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          All Units
        </button>
        {currentUnits.map((unit) => (
          <button
            key={unit}
            type="button"
            onClick={() => setSelectedUnit(unit)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedUnit === unit
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* Upload Button */}
      <button
        type="button"
        onClick={onOpenUpload}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/30 cursor-pointer flex items-center gap-1.5"
      >
        <span>+ Upload</span>
      </button>
    </header>
  );
}
