import mongoose from "mongoose";

/*
| Classification         | Validation Logic                                                                                |
|------------------------|-------------------------------------------------------------------------------------------------|
| qualitative            |          fieldName matches stringValue.                                                         |
| quantitative           |          a value matches numberValue.                                                           |
| quantitative_range     |          a value falls within numberRange.                                                      |
| date_range             | Check if dateRange.from and dateRange.to cover the current date or booking date.                |
| recurring_time_frame   |          the current date falls within 'from' and 'to' and matches the daysOfWeek, days, months.|
| instance_count         |          the context's id, or id/ids in context's [fieldName] (depending on queryIds),          |
|                        |          is found a min amount of times in another Model                                        |
 */

const CriteriaSchema = new mongoose.Schema(
  {
    classification: {
      type: String,
      required: true,
      enum: [
        "qualitative",
        "quantitative",
        "range",
        "date_range",
        "recurring_time_frame",
        "temporary_deals",
        "instance_count",
      ],
    },
    criterionName: { type: String, required: true }, // Name of the criterion
    subject: { type: String, enum: ["user", "listing", "booking", "other"] }, // Setting this to any of the first three items will mark it as a root
    fieldName: { type: String, required: true }, // Field where data that is to be validated can be found at
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
    modelName: { type: String, required: false }, // Model to validate against
    queryIds: { type: String, enum: ["context", "field"] }, // On counting documents, this tells wether the query should be made using the context id in another model, or if other ids stored in a field of the model should be used instead
    nestedCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria",
        required: false,
      },
    ],
    parentCriteria: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Criteria",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

// Validate model and field in document
CriteriaSchema.pre("save", async function (next) {
  try {
    if (this.classification === "instance_count" && !this.modelName) {
      const error = new Error(
        "Missing model for instance_count classification"
      );
      return next(error);
    }
    // If classification is not instance_count we cannot validate the field
    if (this.classification !== "instance_count") return next();

    const modelValid = await isModelAndFieldValid(
      this.modelName,
      this.fieldName
    );
    if (!modelValid) {
      const error = new Error("Invalid model or field");
      return next(error);
    }
    return next();
  } catch (error) {
    console.error(`Error validating reference field: ${error.message}`);
    return next(error);
  }
});
// Set time to ISO
CriteriaSchema.pre("save", function (next) {
  const dateFields = Object.keys(this.schema.paths).filter(
    (path) => this[path] instanceof Date
  );

  dateFields.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toISOString();
    }
  });

  return next();
});
// Update fields from parents and children to include this document
CriteriaSchema.pre("save", async function (next) {
  try {
    // $each has been added in order to work together with the parent/children updating middleware
    for (const node of this.nestedCriteria) {
      await Criteria.findOneAndUpdate(
        { _id: node._id },
        { $push: { parentCriteria: { $each: [this._id] } } },
        { skipHook: true }
      );
    }
    for (const node of this.parentCriteria) {
      await Criteria.findOneAndUpdate(
        { _id: node._id },
        { $push: { nestedCriteria: { $each: [this._id] } } },
        { skipHook: true }
      );
    }
    return next();
  } catch (error) {
    console.error(
      `Error updating fields in parents and/or children of this document: ${error.message}`
    );
    return next(error);
  }
});
// Update fields from parents and children to include this document
CriteriaSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this.options.skipHook) return next();

    const update = this.getUpdate();
    const pushed = update.$push || {};
    const pulled = update.$pull || {};
    const original = await this.model.findOne(this.getQuery()).lean();

    async function updateNestedCriteria(updatedIds, updateOperation, field) {
      for (const id of updatedIds) {
        await Criteria.findOneAndUpdate(
          { _id: id },
          { [updateOperation]: { [field]: original._id } },
          { skipHook: true }
        );
      }
    }

    if (pushed.nestedCriteria) {
      await updateNestedCriteria(
        pushed.nestedCriteria.$each,
        "$push",
        "parentCriteria"
      );
    }
    if (pushed.parentCriteria) {
      await updateNestedCriteria(
        pushed.parentCriteria.$each,
        "$push",
        "nestedCriteria"
      );
    }
    if (pulled.nestedCriteria) {
      await updateNestedCriteria(
        pulled.nestedCriteria.$in,
        "$pull",
        "parentCriteria"
      );
    }
    if (pulled.parentCriteria) {
      await updateNestedCriteria(
        pulled.parentCriteria.$in,
        "$pull",
        "nestedCriteria"
      );
    }

    return next();
  } catch (error) {
    console.error(
      `Error updating fields in new crtierion for this document: ${error.message}`
    );
    return next(error);
  }
});

const isModelAndFieldValid = async function (modelName, fieldName) {
  try {
    // Check if the model exists
    const Model = mongoose.model(modelName);

    if (!Model) return false;

    const field = Object.keys(Model.schema.paths).filter(
      (path) => Model.schema.paths[path] === fieldName
    );
    if (!field) return false;
    return true;
  } catch (error) {
    // Handle any errors (e.g., database error)
    console.error(`Error validating model: ${error.message}`);
    return false;
  }
};

const Criteria = mongoose.model("Criteria", CriteriaSchema);
export default Criteria;
/*

"qualitative", // A field to validate in the same model
          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "qualitative",
          "fieldName": "bathrooms",
          "numberValue": 2,
          "modelName": "Listing",
          "nestedCriteria": []

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "qualitative",
          "fieldName": "country",
          "stringValue": "Germany",
          "modelName": "Listing",
          "nestedCriteria": [
            "_id": "QOMBER9823MSV9SDFSD9",
            "classification": "qualitative",
            "fieldName": "state",
            "stringValue": "Berlin",
            "modelName": "Listing",
            "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "qualitative",
              "fieldName": "sublocality",
              "stringValue": "Lichtenberg",
              "modelName": "Listing",
              "nestedCriteria": [
            
              ]
            ]
          ]

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: February, to: July},
          "modelName": "BookingReservationLocalTime",
          "nestedCriteria": [
            "_id": "QOMBER9823MSV9SDFSD9",
            "classification": "range_date",
            "fieldName": "date",
          "dateRange": {from: 1, to: 4},
            "modelName": "BookingReservationLocalTime",
            "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
          "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "nestedCriteria": [
            
              ]
            ]
          ]

          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: February 1st, to: February 4th},
          "modelName": "BookingReservationLocalTime",
          "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
              "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "nestedCriteria": []
          ]
          "_id": "S9898VFD8080SV9SDFSD9",
          "classification": "range_date",
          "fieldName": "month",
          "dateRange": {from: July 1st, to: July 4th},
          "modelName": "BookingReservationLocalTime",
          "nestedCriteria": [
              "_id": "QOMBER9823MSV9SDFSD9",
              "classification": "range_date",
              "fieldName": "hour",
              "dateRange": {from: 1, to: 3},
              "modelName": "BookingReservationLocalTime",
              "nestedCriteria": []
          ]

      "instance_count", // count of registries in other models
          "_id": "VVS90DVSV80B0SID09F8W9H8F",
          "classification": "instance_count",
          "fieldName": "refered_by",
          "numberRange": {minValue: 5},
          "modelName": "User",
          "contextIdField": "_id",
          "nestedCriteria": []

          "_id": "AD800AS8F0AS8F9AGS9",
          "classification": "instance_count",
          "fieldName": "bookingsCount",
          "numberRange": {minValue: 6},
          "modelName": "Booking",
          "contextIdField": "guest_id",
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

//------------------------------------------USER------------------------------------------//

/*
-----------Qualitative-----------
------------User Rank------------
{
  _id: 'userCriterionId-1',
  classification: 'qualitative',
  criterionName: 'User Type and Rank',
  fieldName: 'userType',
  stringValue: 'gold',
  modelName: 'User',
  referenceField: '_id',
  nestedCriteria: []
}

-----------Instance Count-----------
-------Referrals and Bookings-------
{
  _id: 'userCriterionId-3',
  classification: 'instance_count',
  criterionName: 'Referrals and Bookings',
  fieldName: 'refered_by',
  numberRange: { minValue: 5 },
  modelName: 'User',
  nestedCriteria: []
}

{
  _id: 'userCriterionId-46',
  classification: 'instance_count',
  criterionName: 'Referrals and Bookings',
  instanceCountRange: { minValue: 5 },
  modelName: 'User',
  referenceField: 'refered_by', // ID of user that's registering the code
  nestedCriteria: [
    {
      _id: 'userCriterionId-48',
      classification: 'instance_count',
      criterionName: 'Referred User Bookings',
      fieldName: 'bookings',
      numberRange: { minValue: 1 },
      modelName: 'Booking',
      referenceField: 'guest_id' // ID of user found
    }
  ]
}

------------Quantitative Range------------
--Account Age (6 months old) and Reviews--
{
  _id: 'userCriterionId-5',
  classification: 'quantitative_range',
  criterionName: 'Account Age and Reviews',
  fieldName: 'createdAt',
  dateRange: { from:  new Date().setMonth(new Date().getMonth() + 6) },
  modelName: 'User',
  referenceField: '_id',
  nestedCriteria: [
    {
      _id: 'userCriterionId-6',
      classification: 'instance_count',
      criterionName: 'Number of Reviews',
      fieldName: 'reviewer',
      numberRange: { minValue: 10 },
      modelName: 'Review',
      referenceField: 'user_id'
    }
  ]
}

-----------Booking Date-----------
------------Early Bird------------
{
  _id: 'userCriterionId-7',
  classification: 'booking_date',
  criterionName: 'Early Bird',
  fieldName: 'bookingDate',
  dateRange: { from: new Date().setMonth(new Date().getMonth() + 1) },
  modelName: 'Booking',
  referenceField: 'guest_id'
}

-----------Recurring Time Frame-----------
-------------Annual Promotion-------------
{
  _id: 'userCriterionId-8',
  classification: 'recurring_time_frame',
  criterionName: 'Annual Promotion',
  recurring_time_frame: {
    months: [6, 7, 8], // June, July, August
    daysOfWeek: [5, 6] // Saturday, Sunday
  },
  modelName: 'User',
  referenceField: 'createdAt'
}

*/

//------------------------------------------LISTING------------------------------------------//

/*
-----------Qualitative-----------
-----Payment Method and Bank-----
{
  _id: 'bookingCriterionId-1',
  classification: 'qualitative',
  criterionName: 'Payment Method and Status',
  fieldName: 'paymentMethod',
  stringValue: 'credit_card',
  modelName: 'Booking',
  referenceField: '_id',
  nestedCriteria: [
    {
      _id: 'bookingCriterionId-2',
      classification: 'qualitative',
      criterionName: 'Payment Method',
      fieldName: '_id',
      stringValue: 'A09FSD0G9SDUV09SD09A0',
      modelName: 'PaymentMethods',
      referenceField: 'card_id'
    }
  ]
}

-----------Instance Count-----------
This does not apply to Bookings because 
the id of the document will never appear
in any other model. Or at least any model
that the Booking has to be validated
against.

-----------Quantitative Range-----------
-------------Week-long stay-------------
{
  _id: 'bookingCriterionId-5',
  classification: 'quantitative_range',
  criterionName: 'Week-long stay',
  fieldName: 'stayDuration',
  numberRange: { minValue: 7, maxValue: 27 },
  modelName: 'Booking',
  referenceField: '_id',
  nestedCriteria: []
}

-----------Booking Date-----------
------------Peak Season-----------
{
  _id: 'bookingCriterionId-7',
  classification: 'booking_date',
  criterionName: 'Peak Season',
  fieldName: 'bookingDate',
  dateRange: { from: new Date('2023-12-20'), to: new Date('2023-12-31') },
  modelName: 'Booking',
  referenceField: '_id'
}

-----------Recurring Time Frame-----------
---------------Weekend Stays--------------
{
  _id: 'bookingCriterionId-8',
  classification: 'recurring_time_frame',
  criterionName: 'Weekend Stays',
  recurring_time_frame: {
    daysOfWeek: [5, 6] // Saturday, Sunday
  },
  modelName: 'Booking',
  referenceField: 'startDate'
}

*/

//------------------------------------------BOOKING------------------------------------------//

/*
-----------Qualitative-----------
-----Country and Price Range-----
{
  _id: 'listingCriterionId-1',
  classification: 'qualitative',
  criterionName: 'Country and Price Range',
  fieldName: 'country',
  stringValue: 'USA',
  modelName: 'Listing',
  referenceField: '_id',
  nestedCriteria: [
    {
      _id: 'listingCriterionId-2',
      classification: 'quantitative_range',
      criterionName: 'Price Range',
      fieldName: 'price_per_night',
      numberRange: { minValue: 3000, maxValue: 6000 },
      modelName: 'Listing',
      referenceField: '_id'
    }
  ]
}
-----------Instance Count-----------
----Number of Bookings and Nights---
{
  _id: 'listingCriterionId-3',
  classification: 'instance_count',
  criterionName: 'Number of Bookings and Nights',
  fieldName: 'bookings',
  numberRange: { minValue: 5 },
  modelName: 'Booking',
  referenceField: 'listing_id',
  nestedCriteria: [
    {
      _id: 'listingCriterionId-4',
      classification: 'quantitative_range',
      criterionName: 'Number of Nights',
      fieldName: 'nights',
      numberRange: { minValue: 6 },
      modelName: 'Booking',
      referenceField: 'listing_id'
    }
  ]
}

-----------Quantitative Range-----------
------------Price and Rating------------
{
  _id: 'listingCriterionId-5',
  classification: 'quantitative_range',
  criterionName: 'Price and Rating',
  fieldName: 'price_per_night',
  numberRange: { minValue: 200, maxValue: 500 },
  modelName: 'Listing',
  referenceField: '_id',
  nestedCriteria: [
    {
      _id: 'listingCriterionId-6',
      classification: 'quantitative_range',
      criterionName: 'Rating',
      fieldName: 'rating',
      numberRange: { minValue: 4 },
      modelName: 'Listing',
      referenceField: '_id'
    }
  ]
}

-----------Booking Date-----------
-------Specific Date Range--------
{
  _id: 'listingCriterionId-7',
  classification: 'booking_date',
  criterionName: 'Specific Date Range',
  fieldName: 'bookingDate',
  dateRange: { from: new Date('2023-06-01'), to: new Date('2023-06-30') },
  modelName: 'Booking',
  referenceField: 'listing_id'
}


-----------Recurring Time Frame-----------
--------------Holiday Season--------------
{
  _id: 'listingCriterionId-8',
  classification: 'recurring_time_frame',
  criterionName: 'Holiday Season',
  recurring_time_frame: {
    months: [12],
    days: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  },
  modelName: 'Booking',
  referenceField: 'listing_id'
}



*/
