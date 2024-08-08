import mongoose from "mongoose";

/*
| Classification       | Validation Logic                                                                               |
|----------------------|------------------------------------------------------------------------------------------------|
| qualitative          | Check if fieldName matches stringValue.                                                        |
| quantitative         | Check if a value matches numberValue.                                                          |
| quantitative_range   | Check if a value falls within numberRange.                                                     |
| date_range           | Check if dateRange.from and dateRange.to cover the current date or booking date.               |
| recurring_time_frame | Check if the current date falls within from and to and matches the daysOfWeek, days, months.   |
 */

const DiscountCriteriaSchema = new mongoose.Schema(
  {
    classification: {
      type: String,
      required: true,
      enum: [
        "qualitative",
        "quantitative",
        "quantitative_range",
        "date_range",
        "recurring_time_frame",
      ],
    },
    criterionName: { type: String, required: true }, // Name of the criterion
    fieldName: { type: String, required: true }, // Field to validate against
    stringValue: { type: String, required: false }, // String value for comparison
    stringOptions: [{ type: String, required: false }], // Enumerated string options
    numberValue: { type: Number, required: false }, // Number value for comparison
    numberRange: {
      minValue: { type: Number, required: false }, // Minimum value for number range
      maxValue: { type: Number, required: false }, // Maximum value for number range
    },
    dateRange: {
      from: { type: Date, required: false }, // Start date
      to: { type: Date, required: false }, // End date
    },
    recurring_time_frame: {
      months: [{ type: Number, min: 1, max: 12, required: false }], // Months of the year (1-12)
      days: [{ type: Number, min: 1, max: 31, required: false }], // Days of the month (1-31)
      daysOfWeek: [{ type: Number, min: 0, max: 6, required: false }], // Days of the week (0-6, Sunday-Saturday)
    },
    modelName: { type: String, required: true }, // Model to validate against
    nestedCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiscountCriteria",
        required: false,
      },
    ],
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

    // const referenceValid = await isReferenceValid(
    //   this.modelName,
    //   this.referenceField
    // );
    // if (!referenceValid) {
    //   const error = new Error("Invalid reference field");
    //   return next(error);
    // }
    return next();
  } catch (error) {
    console.error(`Error validating reference field: ${error.message}`);
    return false;
  }
});

const toISOStringMiddleware = (next) => {
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

DiscountCriteriaSchema.pre("save", toISOStringMiddleware);

const DiscountCriteria = mongoose.model(
  "DiscountCriteria",
  DiscountCriteriaSchema
);
export default DiscountCriteria;

// const isReferenceValid = async function (modelName, referenceField) {
//   try {
//     // Retrieve the model
//     const ReferencedModel = mongoose.model(modelName);

//     // Check if the referenced field exists in the model
//     const Schema = ReferencedModel.schema;
//     const FieldExists = Schema.path(referenceField) !== undefined;

//     return FieldExists;
//   } catch (error) {
//     // Handle any errors (e.g., database error)
//     console.error(`Error validating reference field: ${error.message}`);
//     return false;
//   }
// };

/*

"qualitative", // A field to validate in the same model
          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "qualitative",
          "fieldName": "bathrooms",
          "numberValue": 2,
          "modelName": "Listing",
          "referenceField": "_id",
          "nestedCriteria": []

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "qualitative",
          "fieldName": "country",
          "stringValue": "Germany",
          "modelName": "Listing",
          "referenceField": "_id",
          "nestedCriteria": [
            "_id": "QOMBER9823MSV9SDFSD9",
            "classification": "qualitative",
            "fieldName": "state",
            "stringValue": "Berlin",
            "modelName": "Listing",
            "referenceField": "_id",
            "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "qualitative",
              "fieldName": "sublocality",
              "stringValue": "Lichtenberg",
              "modelName": "Listing",
              "referenceField": "_id",
              "nestedCriteria": [
            
              ]
            ]
          ]

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: February, to: July},
          "modelName": "BookingReservationLocalTime",
          "referenceField": "_id",
          "nestedCriteria": [
            "_id": "QOMBER9823MSV9SDFSD9",
            "classification": "range_date",
            "fieldName": "date",
          "dateRange": {from: 1, to: 4},
            "modelName": "BookingReservationLocalTime",
            "referenceField": "_id",
            "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
          "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "referenceField": "_id",
              "nestedCriteria": [
            
              ]
            ]
          ]

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: February 1st, to: February 4th},
          "modelName": "BookingReservationLocalTime",
          "referenceField": "_id",
          "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
              "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "referenceField": "_id",
              "nestedCriteria": []
          ]
          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: July 1st, to: July 4th},
          "modelName": "BookingReservationLocalTime",
          "referenceField": "_id",
          "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
              "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "referenceField": "_id",
              "nestedCriteria": []
          ]

      "instance_count", // count of registries in other models
          "_id": "VVS90DVSV80B0SID09F8W9H8F",
          "classification": "instance_count",
          "fieldName": "refered_by",
          "numberRange": {minValue: 5},
          "modelName": "User",
          "referenceField": "_id",
          "nestedCriteria": []

          "_id": "AD800AS8F0AS8F9AGS9",
          "classification": "instance_count",
          "fieldName": "bookingsCount",
          "numberRange": {minValue: 6},
          "modelName": "Booking",
          "referenceField": "guest_id",
          "nestedCriteria": []

      "listing_feature", // bathrooms, rooms, etc
      "booking_duration",
      "time_constraints", // Specific timeframes that the code will be applicable for (weekends, summer, mornings) up until the code's expiry date or maxUsage reached.
      // If code is applicable only at mornings and nights, two criterion must be crated

      "range", // price 2000

      "recurring_dates",
      User birthday: birthdata equal to from now() 00:00:00 to now() 23:59:59 every year
      Weekly discount on Fridays and Saturdays on months 4, 7 and 9  

      REMEMBER: Time is always stored as ISO dates, and the data that will be taken into account for discounts using dates is the booking date
      It doesn't matter if the time constraint is a different one for each location, like the summer season. Becase everything is in ISO time,
      The listing booked could be one in Pakistan, and the discount code for listings in Pakistan during Pakistanian summer,
      could be applied to a booking done by someone with a different local time, because even if they see "January the 31st" on their booked date,
      the booked date will be changed into ISO time which would then be changed into local time for the host when they look at their bookings
 */
