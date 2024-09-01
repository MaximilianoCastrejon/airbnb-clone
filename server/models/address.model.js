import mongoose from "mongoose";

/*
 * @params Accomodation id refers to the physical layout of the host's property
 */
const AddressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // require: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      // require: true,
    },
    street_name: {
      type: String,
      require: true,
    },
    street_number: {
      type: Number,
      require: true,
    },
    accomodation_local_id: {
      type: String,
    },
    postal_code: {
      type: Number,
      require: true,
    },
    neighbourhood_description: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length <= 255;
        },
        message: "Decription must have a maximum of 255 digits.",
      },
    },
    country: {
      type: String,
      require: true,
    },
    municipality: {
      type: String,
      require: true,
    },
    sublocality: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    place_id: {
      type: String,
      require: true,
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

const Address = mongoose.model("Address", AddressSchema);
export default Address;
