import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    allowedUses: { type: Number },
    startDate: { type: Date, required: true }, // These values go here because we can discontinue codes automatically instead of discontinuing criteria that can be reused for new codes
    expirationDate: { type: Date, required: true },
    criteria: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "DiscountCriteria",
    }, // Array of discount criteria
  },
  { timestamps: true }
);

const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema);
export default DiscountCode;
