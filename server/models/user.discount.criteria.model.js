import mongoose from "mongoose";
import { DiscountCriteriaSchema } from "./discount.criteria.model";

/*
  instances_in_other_models: Tells if doc referencing User complies by certain criteria. And counts
      | Count documents matching id provided at validations check and check against instanceCountRange.| 
|              | If other fields are available, counts these instances instead                                  |
 */

const UserCriteriaSchema = new mongoose.Schema(
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

const UserCriteria = mongoose.model("UserCriteria", UserCriteriaSchema);
export default UserCriteria;

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
  classification: 'instances_in_other_models',
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
