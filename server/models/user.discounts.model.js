import mongoose from "mongoose";

const UserDiscountCodeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  discount_code_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscountCode",
  },
  current_uses: { type: Number, default: 0 },
});

const UserDiscountCode = mongoose.model(
  "UserDiscountCode",
  UserDiscountCodeSchema
);
export default UserDiscountCode;
