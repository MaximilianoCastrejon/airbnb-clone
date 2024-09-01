import mongoose from "mongoose";

const ListingDiscountCodeSchema = new mongoose.Schema({
  listing_id: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  discount_code_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountCode",
  },
  current_uses: { type: Number, default: 0 },
});

const ListingDiscountCode = mongoose.model(
  "ListingDiscountCode",
  ListingDiscountCodeSchema
);
export default ListingDiscountCode;
