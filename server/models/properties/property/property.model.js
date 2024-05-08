import mongoose from "mongoose";

// Custom validator function for latitude
const validateLatitude = (value) => {
  return value >= -90 && value <= 90;
};

// Custom validator function for longitude
const validateLongitude = (value) => {
  return value >= -180 && value <= 180;
};

const ListingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      unique: true,
      require: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      require: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      require: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      require: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      require: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    latitude: {
      type: String,
      validate: {
        validator: validateLatitude,
        message: "Invalid latitude. Must be between -90 and 90 degrees.",
      },
      require: true,
    },
    longitude: {
      type: String,
      validate: {
        validator: validateLongitude,
        message: "Invalid latitude. Must be between -180 and 180 degrees.",
      },

      require: true,
    },
    bedroom_count: {
      type: Number,
      require: true,
    },
    bed_count: {
      type: Number,
      require: true,
    },
    pna_bathroom_count: {
      type: Number,
      require: true,
      default: 0,
    },
    dedicated_bathroom_count: {
      type: Number,
      require: true,
      default: 0,
    },
    shared_bathroom_count: {
      type: Number,
      require: true,
      default: 0,
    },
    accomodates_count: {
      type: String,
      require: true,
    },
    availability_type: {
      type: Number,
      enum: {
        AVAILABLE: 0,
        BOOKED: 1,
        BLOCKED: 2,
        UNDER_MAINTENANCE: 3,
      },
      required: true,
    },
    start_date: {
      type: Date,
      default: Date.now(),
      require: true,
    },
    end_date: {
      type: Date,
    },
    minimum_stay_duration: {
      type: Number,
      default: 1,
    },
    minimum_stay_timeframe: {
      type: String,
      enum: ["day", "week", "month", "year", "night"],
      default: "day",
    },
    refund_type: {
      type: String,
      require: true,
      enum: {
        FLEXIBLE: "flexible",
        MODERATE: "moderate",
        STRICT: "strict",
        SUPER_STRICT_30: "super_strict_30",
        SUPER_STRICT_60: "super_strict_60",
        SUPER_STRICT_LONG_TERM: "super_strict_long_term",
        GRACE_PERIOD: "grace_period",
      },
    },
    checkInTime: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      required: true,
    },
    checkOutTime: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
