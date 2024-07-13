import mongoose from "mongoose";

/*
 * @params Accomodation id refers to the physical layout of the host's property
 */
const DraftAddressSchema = new mongoose.Schema(
  {
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
    street_name: {
      type: String,
      unique: true,
    },
    street_number: {
      type: Number,
    },
    accomodation_local_id: {
      type: String,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    postal_code: {
      type: Number,
      validate: {
        validator: function (value) {
          // Check if the value has a maximum of 5 digits
          return value.toString().length <= 5;
        },
        message: "Number field must have a maximum of 5 digits.",
      },
    },
    neighbourhood_description: {
      type: String,
      validate: {
        validator: function (value) {
          // Check if the value has a maximum of 5 digits
          return value.length <= 255;
        },
        message: "Decription must have a maximum of 255 digits.",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DraftAddress = mongoose.model("DraftAddress", DraftAddressSchema);
export default DraftAddress;
