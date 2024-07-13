import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    discount: { type: Number, require: true },
    max_number_of_uses: { type: Number }, //TODO: mkae lowest possible value 0
    max_number_of_uses_per_user: { type: Number }, //TODO: mkae lowest possible value 0
    startDate_UTC: { type: Date, require: true }, // These values go here because we can discontinue codes automatically instead of discontinuing criteria that can be reused for new codes
    expirationDate_UTC: { type: Date, require: true },
    userCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCriteria",
        required: false,
      },
    ],

    listingCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ListingCriteria",
        required: false,
      },
    ],

    bookingCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BookingCriteria",
        required: false,
      },
    ],
    // Array of discount criteria
    not_applicable_message: { type: String, require: true }, // Criteria in text form
  },
  { timestamps: true }
);

const toISOStringMiddleware = function (next) {
  const dateFields = Object.keys(this.schema.paths).filter(
    (path) => this[path] instanceof Date
  );

  dateFields.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toISOString();
    }
  });

  next();
};

DiscountCodeSchema.pre("save", toISOStringMiddleware);

const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema);
export default DiscountCode;
