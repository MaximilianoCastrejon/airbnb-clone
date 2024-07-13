import mongoose from "mongoose";

// Set a price for particular dates for a listing
const CalendarPriceSchema = new mongoose.Schema({
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    require: true,
  },
  private_notes: String,
  date_start: Date,
  date_end: Date,
  price: Number,
});

const CalendarPrice = mongoose.model("CalendarPrice", CalendarPriceSchema);
export default CalendarPrice;
