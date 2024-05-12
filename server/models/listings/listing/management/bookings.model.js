import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lsiting",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    check_in_date: {
      type: Date,
      required: true,
    },
    check_out_date: {
      type: Date,
      required: true,
    },
    price_per_day: {
      type: Number,
      required: true,
    },
    price_for_stay: {
      type: Number,
      required: true,
    },
    tax_paid: {
      type: Number,
      required: true,
    },
    site_fees: {
      type: Number,
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    is_refund: {
      type: Boolean,
      default: false,
    },
    cancel_date: {
      type: Date,
    },
    refund_paid: {
      type: Number,
    },
    transaction_id: {
      type: String,
    },
    effective_amount: {
      type: Number,
    },
    booking_date: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"], // Adjust the possible values based on your needs
      default: "pending",
    },
  },
  { timestamps: true }
);

const BookingModel = mongoose.model("Booking", BookingSchema);

export default BookingModel;
