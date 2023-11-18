import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      unique: true,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    profile_image: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
export default Property;
