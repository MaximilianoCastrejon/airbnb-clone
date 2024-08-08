import mongoose from "mongoose";
import { DiscountCriteriaSchema } from "./discount.criteria.model.js";

const BookingCriteriaSchema = new mongoose.Schema(
  {
    ...DiscountCriteriaSchema.obj,
  },
  { timestamps: true }
);

const BookingCriteria = mongoose.model(
  "BookingCriteria",
  BookingCriteriaSchema
);
export default BookingCriteria;

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
