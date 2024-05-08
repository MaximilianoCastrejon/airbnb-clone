import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    amenity_id: {
      type: mongoose.Schema.Types.ObjectId,
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
