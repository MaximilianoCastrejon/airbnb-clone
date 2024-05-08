import mongoose from "mongoose";

/*
Residential
Commercial
Vacation Rentals
Industrial
Agricultural
Hospitality (for establishments like Bed & Breakfast)
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
