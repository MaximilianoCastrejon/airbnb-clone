import mongoose from "mongoose";

const ListingPhotoSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    added_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ListingPhoto = mongoose.model("ListingPhoto", ListingPhotoSchema);
export default ListingPhoto;
