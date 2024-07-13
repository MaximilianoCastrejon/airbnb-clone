const UserDiscountCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  discountCodeId: { type: mongoose.Schema.Types.ObjectId, ref: "DiscountCode" },
  maxUses: Number,
  currentUses: { type: Number, default: 0 },
});

const UserDiscountCode = mongoose.model(
  "UserDiscountCode",
  UserDiscountCodeSchema
);
export default UserDiscountCode;
