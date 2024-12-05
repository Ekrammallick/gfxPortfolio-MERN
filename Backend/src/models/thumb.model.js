import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema);
 export default Thumbnail