import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      require: true,
    },
    amenity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      require: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Amenity = mongoose.model("Amenity", AmenitySchema);
export default Amenity;
