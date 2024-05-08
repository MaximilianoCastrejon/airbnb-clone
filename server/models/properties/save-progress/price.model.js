import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    price: {
      type: String,
    },
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
    // Number for the timeframe
    duration: {
      type: Number,
    },
    timeframe: {
      type: String,
      enum: ["day", "week", "month", "year", "night"],
    },
  },
  { timestamps: true }
);

const Price = mongoose.model("Price", PriceSchema);
export default Price;
