import { DiscountCriteriaSchema } from "./discount.criteria.model";

const ListingCriteriaSchema = new mongoose.Schema(
  {
    ...DiscountCriteriaSchema.obj,
    instances_in_other_models: {
      type: Boolean,
      require: true,
      default: false,
    },
    instanceCountRange: {
      minValue: { type: Number, required: false }, // Minimum instances
      maxValue: { type: Number, required: false }, // Maximum instances
    },
    referenceField: { type: String, required: true }, // Field where the id of the document to validate against, is found
  },
  { timestamps: true }
);

const ListingCriteria = mongoose.model(
  "ListingCriteria",
  ListingCriteriaSchema
);
export default ListingCriteria;

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
