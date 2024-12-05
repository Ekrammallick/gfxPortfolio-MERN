import Thumbnail from "../models/thumb.model.js";
import cloudinary from "../libs/cloudinary.js";


export const addThumb = async (req, res) => {
    const { userId } = req.body;
    let files = req.files.imageFiles;
    if (!Array.isArray(files)) {
        files = [files]; // Wrap single file into an array
    }
    
    if (!userId || !files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ message: "userId and at least one image file are required." });
    }

    try {
        const imageUrls = [];
        const createdThumbnails = [];

        for (const file of files) {
            const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "thumbnails",
                resource_type: "auto",
            });

            imageUrls.push(uploadResponse.secure_url);

            const newThumbnail = new Thumbnail({
                userId,
                imageUrl: uploadResponse.secure_url,
                publicId: uploadResponse.public_id,
            });

            const savedThumbnail = await newThumbnail.save();
            createdThumbnails.push(savedThumbnail);
        }

        res.status(201).json({ message: "Thumbnails added successfully.", data: createdThumbnails });
    } catch (error) {
        console.error("Error adding thumbnails:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




// Delete Thumbnail Controller
export const deleteThumb = async (req, res) => {
    const { thumbId } = req.body;
       
    if (!thumbId) {
        return res.status(400).json({ message: "Thumbnail ID is required." });
    }

    try {
        const thumbnail = await Thumbnail.findById(thumbId);

        if (!thumbnail) {
            return res.status(404).json({ message: "Thumbnail not found." });
        }

        if (thumbnail.publicId) {
            await cloudinary.uploader.destroy(thumbnail.publicId);
        }

        await Thumbnail.findByIdAndDelete(thumbId);
        res.status(200).json({ message: "Thumbnail deleted successfully." });
    } catch (error) {
        console.error("Error deleting thumbnail:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Fetch Thumbnails Controller
export const fetchThumbnails = async (req, res) => {
    try {
        const thumbnails = await Thumbnail.find()
  .sort({ createdAt: -1 }) // Sort by creation date in descending order
  .exec(); // Fetch all thumbnails
        res.status(200).json(thumbnails);
    } catch (error) {
        console.error("Error fetching thumbnails:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


