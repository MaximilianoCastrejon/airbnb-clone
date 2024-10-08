import mongoose from "mongoose";
import ReservationType from "../reservation.type.model.js";
import { Db } from "mongodb";

// Custom validator function for latitude
const validateLatitude = (value) => {
  return value >= -90 && value <= 90;
};

// Custom validator function for longitude
const validateLongitude = (value) => {
  return value >= -180 && value <= 180;
};

// Depending on the ReservationType, some fields do not apply
const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      validate: {
        validator: function (value) {
          return value.length > 32;
        },
        message: "Tittle mmust have less than 32 characters",
      },
      unique: true,
    },
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    reservation_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReservationType",
      require: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      require: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      require: true,
      unique: true,
    },
    price_per_night: {
      type: Number,
      require: true,
    },
    price_currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
    },
    cleaning_fees: {
      type: Number,
      require: false,
    },
    cleaning_fees_percentage: {
      type: Number,
      require: false,
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

    // Entire place & Private rooms
    bedroom_count: {
      type: Number,
      require: true,
    },
    // Entire place & Shared rooms & Private rooms
    bed_count: {
      type: Number,
      require: true,
      default: 1,
    },
    // Entire place & Shared rooms
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
    encounter_type: {
      type: String,
      enum: ["host", "family", "other_guests", "roommates"],
      default: "host",
    },
    /******************************** */
    accomodates_count: {
      type: String,
      require: true,
    },
    availability_type: {
      type: String,
      enum: ["AVAILABLE", "BLOCKED", "UNDER_MAINTENANCE"],
      set: (value) => value.toUpperCase(),
      validate: {
        validator: function (value) {
          const enumValues = ["AVAILABLE", "BLOCKED", "UNDER_MAINTENANCE"];
          return enumValues.includes(value);
        },
        message: (props) =>
          `${props.value} is not a valid enum value for the availability type`,
      },
      default: "AVAILABLE",
      required: true,
    },
    booking_acceptance_type: {
      type: String,
      enum: ["immeadiate", "under_approval"],
      require: true,
    },
    start_date_UTC: {
      type: Date,
      default: Date.now(),
      require: true,
    },
    end_date_UTC: {
      type: Date,
    },
    unavailable_period_UTC: {
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
    checkin_time: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      // required: true,
    },
    checkout_time: {
      type: String, // You can use a specific type (e.g., Date) based on your needs
      // required: true,
    },
    accepted_guest_type: {
      type: String,
      enum: ["Any", "Experienced"],
      default: "Any",
    },
    security_cameras: {
      type: Boolean,
      default: false,
    },
    weapons_around: {
      type: Boolean,
      default: false,
    },
    dangerous_animals_around: {
      type: Boolean,
      default: false,
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
    discount_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "DiscountCode",
      require: true,
    },
  },
  { timestamps: true }
);

ListingSchema.pre(
  ["find", "findOne", "findOneAndUpdate"],
  async function (next) {
    const docCount = await Listing.countDocuments({}, { hint: "_id_" });
    if (docCount === 0) return next();
    const original = await this.model.findOne(this.getQuery()).lean();

    const ReservationType = await ReservationType.findById(
      original.Reservation_type
);
    switch (ReservationType.name) {
      case "shared_room":
        this.select("-bedroom_count -bathrooms");
        break;
      case "entire_place":
        this.select(
          "-lockOnEveryBedroom -private_bathroom_count -dedicated_bathroom_count -shared_bathroom_count -encounterType"
        );
        break;
      case "private_room":
        this.select("-bathrooms");
        break;
    }
    next();
  }
);

const toUTCStringMiddleware = (next) => {
  const dateFields = Object.keys(this.schema.paths).filter(
    (path) => this[path] instanceof Date
  );

  dateFields.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toUTCString();
    }
  });

  next();
};

ListingSchema.pre("save", toUTCStringMiddleware);

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
