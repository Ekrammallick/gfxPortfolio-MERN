import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useThumbStore = create((set) => ({
    thumbnails: [], // Store thumbnails
    isThumbFetching: false, // Fetching state
    isThumbDeleting: false, // Deleting state
    isThumbAdding: false,  // Adding state

    // Fetch thumbnails
    fetchThumbnails: async () => {
        try {
            set({ isThumbFetching: true });
            const res = await axiosInstance.get("thumb/fetch");
            set({ thumbnails: res.data });
            toast.success("Thumbnails fetched successfully");
        } catch (error) {
            console.error("Error fetching thumbnails:", error);
            const message = error.response?.data?.message || "An error occurred while fetching thumbnails";
            toast.error(message);
        } finally {
            set({ isThumbFetching: false });
        }
    },

    // Delete thumbnail
    deleteThumbnail: async (thumbId) => {
        try {
            set({ isThumbDeleting: true });
            await axiosInstance.post("/thumb/delete", { thumbId });
            set((state) => ({
                thumbnails: state.thumbnails.filter((thumb) => thumb._id !== thumbId),
            }));
            toast.success("Thumbnail deleted successfully");
        } catch (error) {
            console.error("Error deleting thumbnail:", error);
            const message = error.response?.data?.message || "An error occurred while deleting the thumbnail";
            toast.error(message);
        } finally {
            set({ isThumbDeleting: false });
        }
    },

    // Add thumbnail
    addThumbnail: async (formData) => {
        try {
            console.log(formData)
            set({ isThumbAdding: true });
    
            const res = await axiosInstance.post("/thumb/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            set((state) => ({
                thumbnails: [...res.data.data, ...state.thumbnails], // Append new thumbnails
            }));
    
            toast.success("Thumbnails added successfully");
        } catch (error) {
            console.error("Error adding thumbnails:", error);
            toast.error("An error occurred while adding thumbnails.");
        } finally {
            set({ isThumbAdding: false });
        }
    },
    
}));

export default useThumbStore;
