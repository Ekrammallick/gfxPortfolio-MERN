import { useState,useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";  // Adjust the import if needed
import { useThumbStore } from "../store/useThumbStore";
import toast from "react-hot-toast";

import { Loader,Trash2,Eye} from "lucide-react";

const HomePage = () => {
 

  const { fetchThumbnails, deleteThumbnail, addThumbnail, thumbnails, isThumbFetching, isThumbAdding} = useThumbStore();  // Using Zustand store
  const [newThumbnailFiles, setNewThumbnailFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const {authUser} = useAuthStore();
   
 
  useEffect(() => {

    fetchThumbnails();
  }, [fetchThumbnails]);
  // Handle delete thumbnail
  const handleDelete = (thumbId) => {
   
    deleteThumbnail(thumbId,);
  };

  const handleAddThumbnail = async () => {
    if (!Array.isArray(newThumbnailFiles) || newThumbnailFiles.length === 0) {
        toast.error("Please select images to upload.");
        return;
    }

    const formData = new FormData();

    // Add each file to FormData
    newThumbnailFiles.forEach((file) => formData.append("imageFiles", file));

    // Add userId (from the auth store) to FormData
    formData.append("userId", authUser._id);
      
    try {
        await addThumbnail(formData); // Adjust `addThumbnail` in the store to send `FormData`
        setNewThumbnailFiles([]); // Clear file input
    } catch (error) {
        console.error("Error uploading thumbnails:", error);
    }
};

  
  
  

  // Modal functionality for showing image in full view
  const openModal = (index) => {
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setCurrentImageIndex(null);
  };

  const showNextImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % thumbnails.length);
    }
  };

  const showPreviousImage = () => {
    if (currentImageIndex !== null) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + thumbnails.length) % thumbnails.length);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>

      {/* Add Thumbnail Button */}
        {/* Add Thumbnail Button */}
        {!authUser ? (
        <div className="my-7 text-center">Please log in to add thumbnails.</div>
      ) : (
        
        <div className="my-7 flex flex-row justify-center align-middle">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewThumbnailFiles([...e.target.files])}
            className="file-input file-input-bordered file-input-info w-full max-w-xs"
          />
          <button
            onClick={handleAddThumbnail}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isThumbAdding}
          >
            {isThumbAdding ? "Adding..." : "Add Thumbnails"}
          </button>
        </div>
      )}
     
      

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-6 gap-4">
        {isThumbFetching ? (
                <div className="absolute inset-0 bg-opacity-50  flex justify-center items-center">
                  <Loader className="h-10 w-10 animate-spin text-gray-500" />
                </div>
              ): thumbnails.map((thumbnail, index) => (
          <div
            key={thumbnail._id}
            className="relative group border rounded-lg overflow-hidden"
          >
            <img
              src={thumbnail.imageUrl}  // Assuming imageUrl is the key for image source
              alt={thumbnail.alt}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openModal(index)}
            />
            {!authUser?"":
            <>
            <Trash2  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hidden group-hover:block"
            onClick={() => handleDelete(thumbnail._id)} />
            <Eye onClick={()=>openModal(index)} className="absolute top-2 right-10 bg-blue-500 text-white p-1 rounded hidden group-hover:block"
             />
             </>
            }
            
          </div>
        ))}
      </div>

      {/* Modal */}
      {currentImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={thumbnails[currentImageIndex].imageUrl}  // Display selected image
              alt={thumbnails[currentImageIndex].alt}
              className="w-full max-w-md"
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
