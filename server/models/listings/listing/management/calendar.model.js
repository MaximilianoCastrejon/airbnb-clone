import mongoose from "mongoose";

// Set a minimum stay restriction for particular dates for a listing
const CalendarTripSchema = new mongoose.Schema({
  listing_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    require: true,
  },

  private_notes: String,
  date_start: Date,
  date_end: Date,
  minimum_trip_length: Number,
});

const CalendarTrip = mongoose.model("CalendarTrip", CalendarTripSchema);
export default CalendarTrip;
