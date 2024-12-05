import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore"; // Adjust the import if needed
import { useThumbStore } from "../store/useThumbStore";
import toast from "react-hot-toast";

import { Loader, Trash2, Eye } from "lucide-react";

const HomePage = () => {
  const {
    fetchThumbnails,
    deleteThumbnail,
    addThumbnail,
    thumbnails,
    isThumbFetching,
    isThumbAdding,
  } = useThumbStore(); // Using Zustand store
  const [newThumbnailFiles, setNewThumbnailFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const { authUser } = useAuthStore();

  useEffect(() => {
    fetchThumbnails();
  }, [fetchThumbnails]);

  const handleDelete = (thumbId) => {
    deleteThumbnail(thumbId);
  };

  const handleAddThumbnail = async () => {
    if (!Array.isArray(newThumbnailFiles) || newThumbnailFiles.length === 0) {
      toast.error("Please select images to upload.");
      return;
    }

    const formData = new FormData();
    newThumbnailFiles.forEach((file) => formData.append("imageFiles", file));
    formData.append("userId", authUser._id);

    try {
      await addThumbnail(formData);
      setNewThumbnailFiles([]);
    } catch (error) {
      console.error("Error uploading thumbnails:", error);
    }
  };

  const openModal = (index) => setCurrentImageIndex(index);
  const closeModal = () => setCurrentImageIndex(null);

  const showNextImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
    }
  };

  const showPreviousImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + thumbnails.length) % thumbnails.length
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Home Page</h1>

      {!authUser ? (
        <div className="my-7 text-center">Please log in to add thumbnails.</div>
      ) : (
        <div className="my-7 flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewThumbnailFiles([...e.target.files])}
            className="file-input file-input-bordered file-input-info w-full sm:max-w-xs"
          />
          <button
            onClick={handleAddThumbnail}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            disabled={isThumbAdding}
          >
            {isThumbAdding ? "Adding..." : "Add Thumbnails"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isThumbFetching ? (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50">
            <Loader className="h-10 w-10 animate-spin text-gray-500" />
          </div>
        ) : (
          thumbnails.map((thumbnail, index) => (
            <div
              key={thumbnail._id}
              className="relative group border rounded-lg overflow-hidden"
            >
              <img
                src={thumbnail.imageUrl}
                alt={thumbnail.alt}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openModal(index)}
              />
              {authUser && (
                <>
                  <Trash2
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hidden group-hover:block"
                    onClick={() => handleDelete(thumbnail._id)}
                  />
                  <Eye
                    onClick={() => openModal(index)}
                    className="absolute top-2 right-10 bg-blue-500 text-white p-1 rounded hidden group-hover:block"
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>

      {currentImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={thumbnails[currentImageIndex].imageUrl}
              alt={thumbnails[currentImageIndex].alt}
              className="w-full max-w-full max-h-screen"
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-700 text-white p-2 rounded"
                onClick={showPreviousImage}
              >
                Previous
              </button>
              <button
                className="bg-gray-700 text-white p-2 rounded"
                onClick={showNextImage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
