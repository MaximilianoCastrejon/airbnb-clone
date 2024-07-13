import mongoose from "mongoose";

const ListingDiscountCodeSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  discountCodeId: { type: mongoose.Schema.Types.ObjectId, ref: "DiscountCode" },
});

const ListingDiscountCode = mongoose.model(
  "ListingDiscountCode",
  ListingDiscountCodeSchema
);
export default ListingDiscountCode;
