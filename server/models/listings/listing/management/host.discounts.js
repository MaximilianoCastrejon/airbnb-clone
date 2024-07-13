import mongoose from "mongoose";

const HostDiscountSchema = new mongoose.Schema({
  listings_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    require: true,
  },
  // Stay duration and reservation time before checkin
  type: {
    type: String,
    enum: ["weekly", "montlhy", "early_bird", "last_minute"],
    require: true,
  },
  percentage: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  days_in_advance: {
    type: Number,
  },
  months_in_advance: {
    type: Number,
  },
});

const HostDiscount = mongoose.model("HostDiscount", HostDiscountSchema);
export default HostDiscount;
