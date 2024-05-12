/*

Residential Subcategories:
  Single Family Home
  Apartment Building
  Condominium
  Townhouse
  Villa
  Duplex
  Loft
  Studio
  Cottage
  Mansion
  Farmhouse
  Ranch

Commercial Subcategories:
  Office Space
  Retail Space
  Restaurant
  Warehouse

Vacation Rentals Subcategories:
  House
  Apartment
  Bed & Breakfast
  Cabin
  Boat
  Treehouse
  Chalet
  Castle
  Igloo
  Tipi
  Tent
  Camper/RV
  Lighthouse
  Cave
  Floating Home
  Earth House
  Dome House
  Barn
  Guesthouse

Industrial Subcategories:
  Manufacturing Facility
  Storage Facility

Agricultural Subcategories:
  Farm  
  Ranch
*/

import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Category",
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
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
  { timestamps: true }
);

const SubCategory = new mongoose.model("SubCatergory", SubCategorySchema);
export default SubCategory;
