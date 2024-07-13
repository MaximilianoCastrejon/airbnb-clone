import mongoose from "mongoose";

const DraftListingPhotoSchema = new mongoose.Schema(
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
    placement: {
      type: Number,
      require: true,
      valida: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Only positive numbers, please",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DraftListingPhoto = mongoose.model(
  "DraftListingPhoto",
  DraftListingPhotoSchema
);
export default DraftListingPhoto;
