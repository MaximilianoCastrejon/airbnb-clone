import mongoose from "mongoose";

// Example: fieldName: country, stringOptions: "Germany", "Nepal", "Japan", "Argentina"
// fieldName: "city", stringValue: "New York"
// Missing logic to validate cities within countries
// fieldName: "price_threshold_per_day", numberValue: "3000"
// fieldName: "min_referal_num", numberValue: 7

// User Interaction: Conditions such as discounts that are unlocked after completing certain tasks or discounts that are only available to users who have referred a certain number of friends.
// fieldName: "", "new_listing", "client_birthday_month"
// time_constraints = mornings (6:00 - 12:00)

const DiscountCriteriaSchema = new mongoose.Schema(
  {
    claisification: {
      type: String,
      required: true,
      enum: [
        "qualitative",
        "geographic", // country, city,
        "user_interactions",
        "listing_feature", // bathrooms, rooms, etc
        "booking_duration",
        "time_constraints", // weekends, summer, mornings
        "range", // price 2000
      ],
    },
    fieldName: { type: String, required: true }, // Type of condition (e.g., "country", "userType", "priceRange")
    stringValue: { type: String, required: false }, // String value for comparison
    stringOptions: [{ type: String, required: false }], // Enumerated string options
    units: { type: String, enum: ["days, half, full, m2, y2"] }, //
    numberValue: { type: Number, required: false }, // Number value for comparison
    numberRange: {
      minValue: { type: Number, required: false }, // Minimum value for number range
      maxValue: { type: Number, required: false }, // Maximum value for number range
    },
    startDate: { type: Date, required: false }, // Start date for time frame
    endDate: { type: Date, required: false }, // End date for time frame
    modelName: { type: String, required: true }, // Where to find the field to contrast discount criteria with either the listing, user or reservations by user
    referenceField: { type: String, require: true },
  },
  { timestamps: true }
);

// Validate reference
DiscountCriteriaSchema.pre("save", async function (next) {
  try {
    const modelValid = await isModelValid(this.modelName);
    if (!modelValid) {
      const error = new Error("Invalid model");
      return next(error);
    }

    const referenceValid = await isReferenceValid(
      this.modelName,
      this.referenceField
    );
    if (!referenceValid) {
      const error = new Error("Invalid reference field");
      return next(error);
    }
    return next();
  } catch (error) {
    console.error(`Error validating reference field: ${error.message}`);
    return false;
  }
});

const DiscountCriteria = mongoose.model(
  "DiscountCriteria",
  DiscountCriteriaSchema
);
export default DiscountCriteria;

const isModelValid = async function (modelName) {
  try {
    // Check if the model exists
    const ModelExists = mongoose.modelNames().includes(modelName);
    if (!ModelExists) {
      return false; // Model does not exist
    }
    return true;
  } catch (error) {
    // Handle any errors (e.g., database error)
    console.error(`Error validating model: ${error.message}`);
    return false;
  }
};

const isReferenceValid = async function (modelName, referenceField) {
  try {
    // Retrieve the model
    const ReferencedModel = mongoose.model(modelName);

    // Check if the referenced field exists in the model
    const Schema = ReferencedModel.schema;
    const FieldExists = Schema.path(referenceField) !== undefined;

    return FieldExists;
  } catch (error) {
    // Handle any errors (e.g., database error)
    console.error(`Error validating reference field: ${error.message}`);
    return false;
  }
};
