import mongoose from "mongoose";

/*
Private home 
  - rooms, bathrooms, beds
Single room 
  - no bathrooms options
  - all rooms have a lock?
  - types of bathrooms
 */

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      require: true,
    },
    svg_icon_paths: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0,
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

const Category = mongoose.model("Category", CategorySchema);
export default Category;
