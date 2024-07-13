import mongoose from "mongoose";

const CurrencyStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  UNDER_REVIEW: 3,
  SUSPENDED: 4,
  OBSOLETE: 5,
  PENDING_ACTIVATION: 6,
};

const CurrencySchema = new mongoose.Schema({
  name: { type: String, require: true },
  iso_code: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length === 3;
      },
      message: "ISO code is expected to have three digits",
    },
  },
  icon: { type: String, require: true },
  status: {
    type: Number,
    enum: Object.values(CurrencyStatus),
    default: CurrencyStatus.ACTIVE,
  },
});

const Currency = mongoose.model("Currency", CurrencySchema);
export default Currency;
