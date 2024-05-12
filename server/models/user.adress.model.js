import mongoose from "mongoose";

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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
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
