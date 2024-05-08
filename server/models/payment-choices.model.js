import mongoose from "mongoose";

const PaymentChoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPaymentOption",
    require: true,
  },
});

const PaymentChoice = mongoose.model("PaymentChoice", PaymentChoiceSchema);
export default PaymentChoice;
