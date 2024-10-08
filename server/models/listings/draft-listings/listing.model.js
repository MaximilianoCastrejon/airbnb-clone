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
 * Host id will always be store in cohosts as well as in published_by
 */
const DraftListingSchema = new mongoose.Schema(
  {
    tittle: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length > 32;
        },
        message: "Tittle mmust have less than 32 characters",
      },
      unique: true,
    },
    published_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    cohosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    description: {
      type: String,
    },
    reservation_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationType",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      unique: true,
    },
    price_per_night: {
      type: Number,
    },
    price_currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
    show_exact_location: {
      type: Boolean,
      default: false,
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

    // Entire place & Private rooms
    bedroom_count: {
      type: Number,
    },
    bed_count: {
      type: Number,
      default: 1,
    },
    // Shared rooms & Entire place
    bathrooms: {
      type: Number,
      default: 0,
    },
    // Private rooms
    lockOnEveryBedroom: {
      type: Boolean,
    },
    private_bathroom_count: {
      type: Number,
      default: 0,
    },
    dedicated_bathroom_count: {
      type: Number,
      default: 0,
    },
    shared_bathroom_count: {
      type: Number,
      default: 0,
    },
    encounterType: {
      type: String,
      enum: ["host", "family", "other_guests", "roommates"],
      default: "host",
    },
    /******************************** */
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
      required: true,
    },
    booking_acceptance_type: {
      type: String,
      enum: ["immeadiate", "under_approval"],
    },
    start_date_ISO: {
      type: Date,
      default: Date.now(),
    },
    end_date_ISO: {
      type: Date,
    },
    unavailable_period_ISO: {
      from: { type: Date },
      to: {
        type: Date,
        validate: {
          validator: function (value) {
            return this.from < value;
          },
          message: "To date must be after the From date",
        },
      },
    },
    minimum_stay_duration: {
      type: Number,
      default: 1,
    },
    maximum_stay_duration: {
      type: Number,
      default: 365,
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
    checkin_time: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      required: true,
    },
    checkout_time: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      required: true,
    },
    accepted_guest_type: {
      type: String,
      enum: ["Any", "Experienced"],
      default: "Any",
    },
    securityCameras: {
      type: Boolean,
      default: false,
    },
    weaponsAround: {
      type: Boolean,
      default: false,
    },
    dangerousAnimalsAround: {
      type: Boolean,
      default: false,
    },
    weekend_custom_price: {
      type: Number,
    },
    applicable_discounts: {
      type: [mongoose.Schema.Types.ObjectId], // Discounts aplied by host (first reservation, week-long stay)
      ref: "DiscountCode",
    },
    checkin_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckInMethod",
    },
    wifi_network_name: {
      type: String,
    },
    wifi_password: {
      type: String,
    },
    house_manual: {
      type: String,
    },
  },
  { timestamps: true }
);

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

DraftListingSchema.pre("save", toISOStringMiddleware);

const DraftListing = mongoose.model("DraftListing", DraftListingSchema);
export default DraftListing;
