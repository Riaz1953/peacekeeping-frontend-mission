// Axios package-ti import kora hocche API request pathanor jonno
import axios from "axios";

// Backend server-er baseURL diye ekta API instance toiri kora hocche
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
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

export default API;
