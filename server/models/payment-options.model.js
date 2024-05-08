import mongoose from "mongoose";

const PaymentOptionSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
});

const PaymentOption = mongoose.model("PaymentOption", PaymentOptionSchema);
export default PaymentOption;
