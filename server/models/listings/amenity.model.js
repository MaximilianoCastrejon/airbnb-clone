import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      require: true,
    },
    description: {
      type: String,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AmenityType",
      require: true,
    },
    icon_path: {
      type: String,
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
