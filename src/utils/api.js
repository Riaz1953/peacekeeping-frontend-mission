// Axios package-ti import kora hocche API request pathanor jonno
import axios from "axios";

// Backend server-er baseURL diye ekta API instance toiri kora hocche
const API = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000/api/v1"
      : "https://peacekeeping-backend-mission.onrender.com/api/v1",
});

// All media fetch o filter korar jonno function
export const fetchMedia = (params) => API.get("/media", { params });

// ID diye nirdishto media detail anar function
export const fetchMediaById = (id) => API.get(`/media/${id}`);

// Cloudinary-te media upload korar function
export const uploadMedia = (formData) =>
  API.post("/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Media information edit korar function
export const updateMedia = (id, data) => API.put(`/media/${id}`, data);

// Media delete korar function
export const deleteMedia = (id) => API.delete(`/media/${id}`);

// Like or unlike toggle korar function
export const toggleLikeMedia = (id, userId) =>
  API.patch(`/media/${id}/like`, { userId });

// Dynamic missions ebong units fetch korar function
export const getMissionsAndUnits = () =>
  API.get("/media/config/missions-units");

// Mission ba unit add/delete (manage) korar function
export const manageMissionUnit = (data) =>
  API.post("/media/config/missions-units", data);

// --- CATEGORY API FUNCTIONS ---
export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories", data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;
