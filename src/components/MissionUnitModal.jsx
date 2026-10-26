"use client";
import React, { useState, useEffect } from "react";
import { manageMissionUnit } from "@/utils/api";
import api from "@/utils/api"; // category fetch ba manage korar jonno
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

  // Category states
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!newMission.trim()) return;
    try {
      await manageMissionUnit({
        mission: newMission,
        action: "add_mission",
      });
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
      await manageMissionUnit({
        mission,
        action: "delete_mission",
      });
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
      await manageMissionUnit({
        mission: selectedMission,
        unit: newUnit,
        action: "add_unit",
      });
      toast.success("Unit added successfully!");
      setNewUnit("");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add unit");
    }
  };

  const handleDeleteUnit = async (mission, unit) => {
    try {
      await manageMissionUnit({
        mission,
        unit,
        action: "delete_unit",
      });
      toast.success("Unit deleted!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to delete unit");
    }
  };

  // Category Add Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.post("/categories", { name: newCategory });
      toast.success("Category added successfully!");
      setNewCategory("");
      fetchCategories();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  // Category Delete Handler
  const handleDeleteCategory = async (id, catName) => {
    if (!confirm(`Are you sure to delete category ${catName}?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">
            Manage Missions, Units & Categories
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

          {/* --- NEW CATEGORY MANAGEMENT SECTION --- */}
          <form
            onSubmit={handleAddCategory}
            className="flex flex-col gap-2 pt-2 border-t border-slate-800"
          >
            <label className="text-xs font-semibold text-slate-300">
              Add New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Name..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 lowercase"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Add Category
              </button>
            </div>
          </form>

          {/* List Existing Categories */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400">
              Existing Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat._id}
                  className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  {cat.name}
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="text-rose-400 font-bold hover:text-rose-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

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
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
