/*
 *STEPS
 *
 *  Query and populate current level
 *  Search for the model in modelName
 *  Read the classification
 *  Based on the classification, read the neccesary fields
 *
 */

import mongoose from "mongoose";
import DiscountCode from "../models/discount.code.model";
import DiscountCriteria from "../models/discount.criteria.model";

/*
  Example of use:
  const userCriteria = {
    _id: "DVV78F9830R109FVJWN0C"
    classification: 'instance_count',
    fieldName: 'guest_id',
    numberRange: { minValue: 3 },
    modelName: 'Booking',
    referenceField: '_id',
    nestedCriteria: []
};
  const listingCriteria = {
    _id: "VS7D8VA6586928Y3HCB82U9CMAK"
    classification: 'quantitative_range',
    fieldName: 'price_per_night',
    numberRange: { minValue: 2000 },
    modelName: 'Listing',
    referenceField: '_id',
};

  const discountCode = {
    name: "valuable reservations"
    code: "V4LU3#2000"
    // No max number of uses
    max_number_of_uses_per_user: 5
    startDate: "2024-07-23",
    expirationDate: "2024-09-15"
    userCriteria: ["DVV78F9830R109FVJWN0C"],
    listingCriteria: ["VS7D8VA6586928Y3HCB82U9CMAK"],
    bookingCriteria: [{}],
  }

  *VALIDATE userCriteria FOR USER IN ORDER TO ADD USERDISCOUNT DOCUMENT*
  
  const userDiscount = {
    user_id: "AS00A0S98F09DI0V9ISF90DVQ",
    discount_code: "V4LU3#2000",
    max_uses: 5,
    current_uses: 0,
  }

  *VALIDATE listingCriteria FOR LISTING IN ORDER TO ADD LISTINGDISCOUNT DOCUMENT*

  const listingDiscount = {
    listing_id: "NWDCMKR9VU39492O3IJINCWI",
    discount_code: "V4LU3#2000",
  }

  let finalPrice = listing.price;

  #user_discount loop
  const code = listing_discounts.find(discount_code => discount_code === user_discount.discount_code)
  if(code){
    const discount = DiscountCode.findOne({code: code})
    if(discount && Date.now() < discount.expirationDate && Date.now() > discount.expirationDate) finalPrice *= (1-discount.discount)
  }

// Validate user criteria
const isValid = await validateNestedCriteria(userCriteria, userContext);

 */

async function populateNestedCriteria(criteria, criteriaModel) {
  const populatedCriteria = await DiscountCriteria.populate(criteria, {
    path: "nestedCriteria",
    populate: {
      path: "nestedCriteria",
      model: criteriaModel,
    },
  });

  if (populatedCriteria.nestedCriteria.length > 0) {
    for (let i = 0; i < populatedCriteria.nestedCriteria.length; i++) {
      populatedCriteria.nestedCriteria[i] = await populateNestedCriteria(
        populatedCriteria.nestedCriteria[i],
        criteriaModel
      );
    }
  }

  return populatedCriteria;
}
// criteriaType: "userCriteria" | "listingCriteria" | "bookingCriteria"
// criteriaModel: "UserCriteria" | "ListingCriteria" | "BookingCriteria"

async function checkDiscountValidity(
  context,
  discountCodeId,
  criteriaType,
  criteriaModel
) {
  const discountCode = await DiscountCode.findById(discountCodeId).populate(
    criteriaType
  );
  if (!discountCode) throw new Error("Discount code not found");

  const criteria = await populateNestedCriteria(
    discountCode[criteriaType],
    criteriaModel
  );

  let isEligible;

  for (const criterion of criteria) {
    isEligible = await validateNestedCriteria(criterion, context);
    if (!isEligible) {
      break; // Exit the loop if not eligible
    }
  }

  return isEligible;
}

const validateCriteria = async (criterion, context) => {
  switch (criterion.classification) {
    case "qualitative":
      return context[criterion.fieldName] === criterion.stringValue;
    // TODO: change instance count. If I refererd at least 5, then valid. Then if out of results, 5 instances of criterion (i.e. renting for 3 nights), then valid
    case "instantece_count":
      // Count documents that fulfill criterion
      if (criterion.fieldName) {
      }
      if (criterion.numberRange) {
      }
      if (criterion.numberValue) {
      }
      if (criterion.dateRange) {
      }
      if (criterion.numberRange) {
      }
      // TODO: Add count
      const results = await mongoose.model(criterion.modelName).find({
        [criterion.referenceField]: context._id,
      });
      const count = results.length;

      return (
        count >= (criterion.instanceCountRange.minValue || 0) &&
        count <= (criterion.instanceCountRange.maxValue || Infinity)
      );

    case "range":
      const value = context[criterion.fieldName];
      return (
        value >= (criterion.numberRange.minValue || 0) &&
        value <= (criterion.numberRange.maxValue || Infinity)
      );

    case "date_range":
      const date = new Date(context[criterion.fieldName]);
      if (criterion.dateRange.from && criterion.dateRange.to) {
        return (
          date >= new Date(criterion.dateRange.from) &&
          date <= new Date(criterion.dateRange.to)
        );
      }
      return date >= new Date(criterion.dateRange.from || 0);

    case "recurring_time_frame":
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // getMonth is 0-indexed

      const matchesDayOfWeek =
        !criterion.recurringTimeFrame.daysOfWeek ||
        criterion.recurringTimeFrame.daysOfWeek.includes(dayOfWeek);
      const matchesDay =
        !criterion.recurringTimeFrame.days ||
        criterion.recurringTimeFrame.days.includes(day);
      const matchesMonth =
        !criterion.recurringTimeFrame.months ||
        criterion.recurringTimeFrame.months.includes(month);

      return matchesDayOfWeek && matchesDay && matchesMonth;

    case "temporary_deals":
      const now = new Date();
      return (
        now >= new Date(criterion.dateRange.from) &&
        now <= new Date(criterion.dateRange.to)
      );

    default:
      return false;
  }
};

// Example of nested criteria validation
const validateNestedCriteria = async (criterion, context) => {
  if (await validateCriteria(criterion, context)) {
    if (criterion.nestedCriteria && criterion.nestedCriteria.length > 0) {
      for (const nested of criterion.nestedCriteria) {
        const nestedValid = await validateNestedCriteria(nested, context);
        if (!nestedValid) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
};

export default checkDiscountValidity;
