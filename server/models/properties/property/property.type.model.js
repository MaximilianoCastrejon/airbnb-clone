import mongoose from "mongoose";

// House, Apartment, Barn, Bed & Breakfast, Boat, Cabin, etc

const PropertyTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    icon_svg: {
      type: String,
      require: true,
    },
    icon_image_url: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyType = mongoose.model("PropertyType", PropertyTypeSchema);
export default PropertyType;
