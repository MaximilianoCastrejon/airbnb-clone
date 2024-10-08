import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lsiting",
      required: true,
    },
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    guest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    check_in_date_ISO: {
      type: Date,
      required: true,
    },
    check_out_date_ISO: {
      type: Date,
      required: true,
    },
    price_per_night: {
      type: Number,
      required: true,
    },
    total_reservation_cost: {
      type: Number,
      required: true,
    },
    total_discounted_reservation_cost: {
      type: Number,
      required: false,
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
    cancel_date_ISO: {
      type: Date,
    },
    refund_paid: {
      type: Number,
    },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    effective_amount: {
      type: Number,
    },
    booking_date_ISO: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"], // Adjust the possible values based on your needs
      default: "pending",
    },
    canceled_by_host: {
      type: Boolean,
    },
    discount_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "DiscountCode",
      require: true,
    },
    cohost_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      require: true,
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function (next) {
  try {
    const upcomingReservations = await Booking.find({
      check_in_date: { $gte: Date(now) },
    }).select("check_in_date check_out_date");
    const closestReservation = await Booking.findOne({
      check_in_date: { $lt: this.check_in_date },
    })
      .sort("-check_in_date")
      .limit(1);
    upcomingReservations.push(closestReservation);
    for (const dates of upcomingReservations) {
      if (
        this.check_out_date <= dates.check_in_date ||
        this.check_in_date <= dates.check_out_date
      ) {
        continue; // No overlap
      } else {
        throw new Error(
          "Listing is already booked for those dates. Chose another timeframe"
        );
      }
    }
    next();
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
});

const toISOStringMiddleware = (next) => {
  const dateFields = Object.keys(this.schema.paths).filter(
    (path) => this[path] instanceof Date
  );

  dateFields.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toISOString();
    }
  });

  next();
};

BookingSchema.pre("save", toISOStringMiddleware);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
