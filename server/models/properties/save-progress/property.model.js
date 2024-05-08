import mongoose from "mongoose";

// Custom validator function for latitude
const validateLatitude = (value) => {
  return value >= -90 && value <= 90;
};

// Custom validator function for longitude
const validateLongitude = (value) => {
  return value >= -180 && value <= 180;
};

/**
 * Form to let user retireve their progress on their accomodation posting process
 */
const IncompletePropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
    },
    latitude: {
      type: String,
      validate: {
        validator: validateLatitude,
        message: "Invalid latitude. Must be between -90 and 90 degrees.",
      },
    },
    longitude: {
      type: String,
      validate: {
        validator: validateLongitude,
        message: "Invalid latitude. Must be between -180 and 180 degrees.",
      },
    },
    bedroom_count: {
      type: Number,
    },
    bed_count: {
      type: Number,
    },
    bathroom_count: {
      type: Number,
    },
    accomodates_count: {
      type: String,
    },
    availability_type: {
      type: Number,
      enum: {
        AVAILABLE: 0,
        BOOKED: 1,
        BLOCKED: 2,
        UNDER_MAINTENANCE: 3,
      },
    },
    start_date: {
      type: Date,
      default: Date.now(),
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
    },
    checkOutTime: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
    },
  },
  { timestamps: true }
);

const IncompleteProperty = mongoose.model(
  "IncompleteProperty",
  IncompletePropertySchema
);
export default IncompleteProperty;
