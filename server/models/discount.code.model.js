import mongoose from "mongoose";
import Criteria from "./criteria.model.js";
import UserDiscountCode from "./user.discounts.model.js";
import ListingDiscountCode from "./listing.discount.model.js";

const DiscountCodeSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    code: { type: String, require: true, unique: true, trim: true },
    discount: { type: Number, require: true },
    max_number_of_uses: { type: Number }, // If value is -1, it has no max number of uses
    current_uses: { type: Number, default: 0 },
    max_number_of_uses_per_user: { type: Number },
    max_number_of_uses_per_listing: { type: Number },
    startDate: { type: Date, require: true }, // These values go here because we can discontinue codes automatically instead of discontinuing criteria that can be reused for new codes
    expirationDate: { type: Date, require: true },

    criteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria",
        required: false,
      },
    ],
    not_applicable_message: { type: String, require: true }, // Criteria in human readable text format
  },
  { timestamps: true }
);

DiscountCodeSchema.pre("save", function (next) {
  const dateFields = Object.keys(this.schema.paths).filter(
    (path) => this[path] instanceof Date
  );

  dateFields.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toISOString();
    }
  });

  next();
});

async function validateCriteriaAsRoots(doc) {
  try {
    const criteriaIds = doc.criteria.map((id) => id);

    const criteria = await Criteria.find({ _id: { $in: criteriaIds } });

    for (const criterion of criteria) {
      const isRootCriterion = criterion.subject !== "other";
      if (!isRootCriterion) return false;
    }
    return true;
  } catch (error) {
    console.log("Error:", error);
  }
}

DiscountCodeSchema.pre("save", async function (next) {
  try {
    const allCrtieriaAreRoots = await validateCriteriaAsRoots(this);
    if (!allCrtieriaAreRoots) {
      const error = new Error(
        "Some of the criteria for the discount is not applicable to a User, a Listing or a Booking"
      );
      return next(error);
    }
    return next();
  } catch (error) {
    console.error(
      `Error validating criteria for the discount: ${error.message}`
    );
    return next(error);
  }
});
DiscountCodeSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter()).lean();
    const allCrtieriaAreRoots = await validateCriteriaAsRoots(doc);
    if (!allCrtieriaAreRoots) {
      const error = new Error(
        "Some of the criteria for the discount is not applicable to a User, a Listing or a Booking"
      );
      return next(error);
    }
    return next();
  } catch (error) {
    console.error(
      `Error validating criteria for the discount: ${error.message}`
    );
    return next(error);
  }
});

DiscountCodeSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter()).lean();
    await UserDiscountCode.deleteMany({ discount_code_id: doc._id });
    await ListingDiscountCode.deleteMany({ discount_code_id: doc._id });
    return next();
  } catch (error) {
    console.error(
      `Error deleting the code from Listings and Users: ${error.message}`
    );
    return next(error);
  }
});

const DiscountCode = mongoose.model("DiscountCode", DiscountCodeSchema);
export default DiscountCode;
