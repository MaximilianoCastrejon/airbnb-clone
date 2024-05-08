import mongoose from "mongoose";

/*
 * @params Accomodation id refers to the physical layout of the host's property
 */
const AddressSchema = new mongoose.Schema(
  {
    street_name: {
      type: String,
      require: true,
      unique: true,
    },
    street_number: {
      type: Number,
      require: true,
    },
    accomodation_local_id: {
      type: String,
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Property",
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
    country: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Country",
    },
    active: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", AddressSchema);
export default Address;
