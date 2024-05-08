import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      require: true,
    },
    price: {
      type: String,
      require: true,
    },
    currency_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
      require: true,
    },
    // Number for the timeframe
    duration: {
      type: Number,
      require: true,
    },
    timeframe: {
      type: String,
      enum: ["day", "week", "month", "year", "night"],
      require: true,
    },
  },
  { timestamps: true }
);

const Price = mongoose.model("Price", PriceSchema);
export default Price;
