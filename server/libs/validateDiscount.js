import mongoose from "mongoose";
import DiscountCode from "../models/discount.code.model.js";
import Criteria from "../models/criteria.model.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import ListingDiscountCode from "../models/listing.discount.model.js";
import User from "../models/user.model.js";
import Listing from "../models/listings/listing/listing.model.js";

//TODO: Change function to use graphLookup
async function populateNestedCriteria(criterion) {
  let populatedCriteria;
  try {
    populatedCriteria = await Criteria.findById(criterion._id).populate({
      path: "nestedCriteria",
    });
  } catch (error) {
    console.log("Error: ", error);
  }

  if (!populatedCriteria)
    throw new Error(`Criterion with id ${criterion._id} not found in database`);

  if (populatedCriteria.nestedCriteria.length > 0) {
    for (let i = 0; i < populatedCriteria.nestedCriteria.length; i++) {
      populatedCriteria.nestedCriteria[i] = await populateNestedCriteria(
        populatedCriteria.nestedCriteria[i]
      );
    }
  }
  return populatedCriteria;
}

// criteriaType: "user" | "listing" | "booking"
async function validateDiscount(context, discountCode, criteriaType) {
  let discount;
  try {
    if ((criteriaType !== "user") | "listing" | "booking")
      throw new Error(
        "criteriaType has not been properly set. Available options: 'user' | 'listing' | 'booking' "
      );
    discount = await DiscountCode.findOne({ code: discountCode }).populate({
      path: "criteria",
    });
  } catch (error) {
    console.log("Error: ", error);
  }
  if (!discount) throw new Error("Discount code not found in database");

  let criteria = discount.criteria.filter(
    (criterion) => criterion.subject === criteriaType
  );
  let populatedCriteria = [];
  for (const criterion of criteria) {
    populatedCriteria.push(await populateNestedCriteria(criterion));
  }

  // Starts with true so Listings, for example,
  // can add it without having to be validated
  // if there are no validators for Listings to apply the code
  let isEligible = true;

  //Validate parent nodes
  for (const rootCriterion of populatedCriteria) {
    if (!isEligible) continue;
    isEligible = await validateNestedCriteria(rootCriterion, context);
  }

  return isEligible;
}

const validateCriterion = async (criterion, context) => {
  if (!context) return [false];
  const field = criterion.fieldName;
  const min = criterion.numberRange?.minValue;
  const max = criterion.numberRange?.maxValue;

  switch (criterion.classification) {
    case "qualitative":
      // console.log("CONTEXT", context);
      return [context[field] === criterion.stringValue];
    case "quantitative":
      return [context[field] === criterion.numberValue];

    case "range":
      const value = context[field];
      const valueInRange = value >= (min || 0) && value <= (max || Infinity);
      return [valueInRange];

    case "date_range":
      const date = new Date(context[field]);
      if (criterion.dateRange.from && criterion.dateRange.to) {
        return (
          date >= new Date(criterion.dateRange.from) &&
          date <= new Date(criterion.dateRange.to)
        );
      }
      return [date >= new Date(criterion.dateRange.from || 0)];

    case "recurring_time_frame":
      const currentDate = new Date();
      const dayOfWeek = currentDate.getDay();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // getMonth is 0-indexed

      const recurringWeekDays = criterion.recurringTimeFrame.daysOfWeek;
      const recurringMonthDays = criterion.recurringTimeFrame.days;
      const recurringMonths = criterion.recurringTimeFrame.months;

      const matchesDayOfWeek =
        !recurringWeekDays || recurringWeekDays.includes(dayOfWeek);

      const matchesDay =
        !recurringMonthDays || recurringMonthDays.includes(day);

      const matchesMonth = !recurringMonths || recurringMonths.includes(month);

      return [matchesDayOfWeek && matchesDay && matchesMonth];

    case "temporary_deals":
      const now = new Date();
      return [
        now >= new Date(criterion.dateRange.from) &&
          now <= new Date(criterion.dateRange.to),
      ];

    // Change context
    case "instance_count":
      const referrencedDocs = [];
      // let newContext = []; // [{ {},{} }]
      const Model = mongoose.model(criterion.modelName);

      referrencedDocs.push(
        criterion.queryIds === "context" ? context._id : context[field]
      );
      const newContext = await Model.find({
        [field]: { $in: referrencedDocs },
      }).catch((err) => console.log("Error: ", err));

      const lengthInRange =
        newContext.length >= (min || 0) &&
        newContext.length <= (max || Infinity);

      return [lengthInRange, newContext];

    default:
      return [false];
  }
};

// Example of nested criteria validation
const validateNestedCriteria = async (criterion, context) => {
  // console.log("NEXT CRITERION", criterion.criterionName, context);
  const result = await validateCriterion(criterion, context);
  const isValid = result[0];
  const hasNestedCriteria =
    criterion.nestedCriteria && criterion.nestedCriteria.length > 0;

  if (!isValid) return validation("unsuccessful");
  if (!hasNestedCriteria) return validation("successful");

  // newContext is the resulting registries from instance_counts
  const foundDocs = result[1] || [];
  let validDocs = 0;
  const minValue = criterion.numberRange.minValue || 1; // Default to 1 if no minValue
  const maxValue = criterion.numberRange.maxValue || Infinity; // Default to Infinity if no maxValue
  const reachedMaxValue = validDocs > maxValue;

  for (const nestedCriterion of criterion.nestedCriteria) {
    if (foundDocs.length <= 0) {
      const isNestedValid = await validateNestedCriteria(
        nestedCriterion,
        context
      );
      if (isNestedValid) return validation("successful");
      return validation("unsuccessful");
    }
    // Validated nested criteria using the queried docs
    for (const doc of foundDocs) {
      const isEntityValid = await validateNestedCriteria(nestedCriterion, doc);
      if (isEntityValid) {
        ++validDocs;
        if (reachedMaxValue) return validation("unsuccessful");
        return validation("successful");
      }
    }
    if (validDocs < minValue) {
      return validation("unsuccessful");
    }
  }
};

const validation = (result) => {
  if (result === "successful") return true;
  if (result === "unsuccessful") return false;
};

async function bookingCheckoutDiscountValidity(
  user_id,
  listing_id,
  checkout_context
) {
  let validDiscounts = [];
  try {
    const userContext = await User.findById(user_id);
    const listingContext = await Listing.findById(listing_id);
    if (!userContext || !listingContext)
      throw new Error(
        "User or Listing do not exist. Discounts cannot be validated"
      );
    const [userDiscounts, listingDiscounts] = await Promise.all([
      UserDiscountCode.find({ user_id }),
      ListingDiscountCode.find({
        listing_id,
      }),
    ]);

    const matchingDiscounts = userDiscounts.filter((userDiscount) =>
      listingDiscounts.some((listingDiscount) =>
        listingDiscount.discount_code_id.equals(userDiscount.discount_code_id)
      )
    );

    for (const discountCode of matchingDiscounts) {
      const currentUserDiscountCode = userDiscounts.find((doc) =>
        doc.discount_code_id.equals(code.discount_code_id)
      );
      const currentListingDiscountCode = listingDiscounts.find((doc) =>
        doc.discount_code_id.equals(code.discount_code_id)
      );
      if (isCodeExpired(discountCode)) continue;
      if (
        isCodeExhausted(
          discountCode,
          currentUserDiscountCode,
          currentListingDiscountCode
        )
      )
        continue;

      const [isUserEligible, isListingEligible, isBookingEligible] =
        await Promise.all([
          validateDiscount(userContext, discountCode, "user"),
          validateDiscount(listingContext, discountCode, "listingg"),
          validateDiscount(checkout_context, discountCode, "booking"),
        ]);

      if (!isListingEligible || !isUserEligible || !isBookingEligible) {
        throw new Error(discountCode.not_applicable_message);
      }
      validDiscounts.push(discountCode);
    }

    const discountCodes = await DiscountCode.find({
      code: { $in: validDiscounts },
    });
    return discountCodes;
  } catch (error) {
    console.log("Error:", error);
  }
}

const isCodeExpired = (code) => {
  if (Date.now() > code.expirationDate || Date.now() < code.startDate) {
    return true;
  }
};

const isCodeExhausted = (code, userDiscount, listingDiscount) => {
  // Validate the number of usages. If -1, uses are infinite
  const usesAvailable =
    (code.max_number_of_uses === -1 ||
      code.current_uses < code.max_number_of_uses) &&
    (code.max_number_of_uses_per_user === -1 ||
      userDiscount.current_uses < code.max_number_of_uses_per_user) &&
    (code.max_number_of_uses_per_listing === -1 ||
      listingDiscount.current_uses < code.max_number_of_uses_per_listing);

  if (!usesAvailable) {
    return true;
  }
};

export default bookingCheckoutDiscountValidity;

/*
[
    {
        "_id": "66d1ffa85fce2e2db16e9fe2",
        "classification": "instance_count",
        "criterionName": "User has address",
        "fieldName": "address",
        "stringOptions": [],
        "numberRange": {
            "minValue": 1
        },
        "recurring_time_frame": {
            "months": [],
            "days": [],
            "daysOfWeek": []
        },
        "modelName": "Address",
        "queryIds": "field",
        "nestedCriteria": [
            "66ca55757cf217d3381ed97f",
            "66d21b3f760186eceae2dcf3"
        ],
        "parentCriteria": [],
        "createdAt": "2024-08-30T17:21:45.021Z",
        "updatedAt": "2024-08-30T21:22:12.754Z",
        "__v": 0,
        "allParents": [],
        "allChildren": [
            {
                "_id": "66ca55757cf217d3381ed97f",
                "classification": "qualitative",
                "criterionName": "Country in address is: Mexico",
                "fieldName": "country",
                "stringValue": "Mexico",
                "stringOptions": [],
                "recurring_time_frame": {
                    "months": [],
                    "days": [],
                    "daysOfWeek": []
                },
                "queryIds": "context",
                "nestedCriteria": [],
                "parentCriteria": [
                    "66d1ffa85fce2e2db16e9fe2"
                ],
                "createdAt": "2024-08-24T21:49:41.969Z",
                "updatedAt": "2024-08-30T17:21:45.034Z",
                "__v": 0,
                "childDepth": 0
            },
            {
                "_id": "66d21b3f760186eceae2dcf3",
                "classification": "qualitative",
                "criterionName": "Address state is: Michoacan",
                "fieldName": "state",
                "stringValue": "Michoacan",
                "stringOptions": [],
                "recurring_time_frame": {
                    "months": [],
                    "days": [],
                    "daysOfWeek": []
                },
                "queryIds": "context",
                "nestedCriteria": [],
                "parentCriteria": [
                    "66d1ffa85fce2e2db16e9fe2"
                ],
                "createdAt": "2024-08-30T19:19:27.714Z",
                "updatedAt": "2024-08-30T21:22:12.652Z",
                "__v": 0,
                "childDepth": 0
            }
        ]
    }
]
*/
