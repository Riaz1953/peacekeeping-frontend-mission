"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function MissionUnitModal({
  missionUnitsMap,
  onClose,
  onSuccess,
}) {
  const [newMission, setNewMission] = useState("");
  const [selectedMission, setSelectedMission] = useState(
    Object.keys(missionUnitsMap)[0] || "",
  );
  const [newUnit, setNewUnit] = useState("");

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!newMission.trim()) return;
    try {
      await axios.post(
        "https://peacekeeping-backend-mission.onrender.com/api/v1/media/config/missions-units",
        {
          mission: newMission,
          action: "add_mission",
        },
      );
      toast.success("Mission added successfully!");
      setNewMission("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add mission");
    }
  };

  const handleDeleteMission = async (mission) => {
    if (!confirm(`Are you sure to delete mission ${mission}?`)) return;
    try {
      await axios.post(
        "https://peacekeeping-backend-mission.onrender.com/api/v1/media/config/missions-units",
        {
          mission,
          action: "delete_mission",
        },
      );
      toast.success("Mission deleted!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to delete mission");
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!newUnit.trim() || !selectedMission) return;
    try {
      await axios.post(
        "https://peacekeeping-backend-mission.onrender.com/api/v1/media/config/missions-units",
        {
          mission: selectedMission,
          unit: newUnit,
          action: "add_unit",
        },
      );
      toast.success("Unit added successfully!");
      setNewUnit("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add unit");
    }
  };

  const handleDeleteUnit = async (mission, unit) => {
    try {
      await axios.post(
        "https://peacekeeping-backend-mission.onrender.com/api/v1/media/config/missions-units",
        {
          mission,
          unit,
          action: "delete_unit",
        },
      );
      toast.success("Unit deleted!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to delete unit");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">
            Manage Missions & Units
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Add Mission Form */}
          <form onSubmit={handleAddMission} className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Add New Mission
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMission}
                onChange={(e) => setNewMission(e.target.value)}
                placeholder="Mission Name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </form>

          {/* Add Unit Form */}
          <form onSubmit={handleAddUnit} className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Add Unit to Mission
            </label>
            <select
              value={selectedMission}
              onChange={(e) => setSelectedMission(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase"
            >
              {Object.keys(missionUnitsMap).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="Unit Name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 uppercase"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Add Unit
              </button>
            </div>
          </form>

          {/* List Existing Missions & Units */}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400">
              Existing Missions & Units
            </span>
            {Object.entries(missionUnitsMap).map(([mission, units]) => (
              <div
                key={mission}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">
                    {mission}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMission(mission)}
                    className="text-rose-400 text-xs hover:underline"
                  >
                    Delete Mission
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {units.map((unit) => (
                    <span
                      key={unit}
                      className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-[10px] flex items-center gap-1"
                    >
                      {unit}
                      <button
                        type="button"
                        onClick={() => handleDeleteUnit(mission, unit)}
                        className="text-rose-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
