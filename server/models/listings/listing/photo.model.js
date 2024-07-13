import mongoose from "mongoose";

const ListingPhotoSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      require: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      require: true,
    },
    added_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    type: {
      type: String,
      enum: ["aditionals", "bathroom", "bedroom"],
      require: true,
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

/**
 * At least 5 Photos must be chosen by business requirements
 */

ListingPhotoSchema.pre("remove", async function (next) {
  try {
    if (this.type !== "aditionals") next();
    const listingId = this.listing_id;

    // Query the database to count documents with the same listing_id and type
    const count = await ListingPhotoSchema.countDocuments({
      listing_id: listingId,
      type: "aditionals",
    });

    // Check if there are at least 5 other documents with the same listing_id and type
    if (count < 6) {
      // If there are not enough documents, prevent deletion
      throw new Error("Cannot delete document: Not enough photos for listing");
    }

    // If there are enough similar documents, allow deletion
    next();
  } catch (error) {
    next(error);
  }
});

ListingPhotoSchema.index({ listing_id: 1, placement: 1 }, { unique: true });
const ListingPhoto = mongoose.model("ListingPhoto", ListingPhotoSchema);
export default ListingPhoto;
