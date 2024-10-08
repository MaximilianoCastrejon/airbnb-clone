import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import User from "../models/user.model.js";
import DiscountCode from "../models/discount.code.model.js";
import validateDiscount from "../libs/validateDiscount.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import ListingDiscountCode from "../models/listing.discount.model.js";
import Criteria from "../models/criteria.model.js";
import mongoose from "mongoose";

export const getDiscounts = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const getDiscount = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const generateDiscountCode = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(DiscountCode, fields);
  res.status(StatusCodes.OK).json({ result });
};
export const updateDiscount = async (req, res) => {
  const { id } = req.params;
  const { updateFields } = req.body;

  let updateObj = updateFields;
  // Pull ids
  if (updateFields.criteria && updateFields.criteria.pull) {
    updateObj.$pull = {
      criteria: { $in: updateFields.criteria.pull },
    };
    delete updateObj.criteria;
  }
  // Push ids
  if (updateFields.criteria && updateFields.criteria.push) {
    updateObj.$push = {
      criteria: { $each: updateFields.criteria.push },
    };
    delete updateObj.criteria;
  }

  const result = await DiscountCode.findOneAndUpdate({ _id: id }, updateObj, {
    new: true,
  });
  if (!result) {
    throw new Error("Discount Code was not updated");
  }
  res.status(StatusCodes.OK).json(result);
};
export const deleteDiscount = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const checkListingDiscountValidity = async (req, res) => {
  const { id } = req.params;
  const { discountCode } = req.query;

  const context = await Listing.findById(id);

  const isEligible = await validateDiscount(context, discountCode, "listing");
  res.status(StatusCodes.OK).json({});
};

export const checkUserDiscountValidity = async (req, res) => {
  const { id } = req.params;
  const { discountCode } = req.query;

  const context = await User.findById(id);

  const isEligible = await validateDiscount(context, discountCode, "user");
  let discountAdded;
  if (isEligible) {
    const discountCodeId = await DiscountCode.findOne({ code: discountCode });
    discountAdded = await createDocument(UserDiscountCode, {
      user_id: id,
      discount_code_id: discountCodeId,
    });
  }

  if (!discountAdded) {
    throw new Error(
      "Discount code could not be added for this user. Try again later"
    );
  }
  res.status(StatusCodes.OK).json(discountAdded);
};

// export const checkDiscountValidity = (req, res)=>{
//   const {entity} = query.params
//   switch(entity){
//     case "user":

//     break;
//     case "booking": break;
//     case "listing": break;
//   }
// }

export const checkBookingDiscountValidity = async (req, res) => {
  const { discountCodes } = req.query;
  const { user_id, listing_id, context } = req.body;

  let validDiscounts = [];

  for (const code of discountCodes) {
    const discount = await DiscountCode.findOne({ code: code });
    const userDiscountFound = await UserDiscountCode.findOne({
      user_id: user_id,
      discount_code_id: discount._id,
    });
    const listingDiscountFound = await ListingDiscountCode.findOne({
      listing_id: listing_id,
      discount_code_id: discount._id,
    });
    if (!userDiscountFound || !listingDiscountFound) {
      res
        .status(StatusCodes.FORBIDDEN)
        .send(
          `Discount code is not valid for this operation. Either the user has not registered this code on their account or the host is not accepting this discount`
        );
    }
    const isDiscountLimitReached =
      discount.max_number_of_uses <= discount.current_uses;
    const isUserLimitReached =
      discount.max_number_of_uses_per_user <= userDiscountFound.current_uses;
    const isListingLimitReached =
      discount.max_number_of_uses_per_listing <=
      listingDiscountFound.current_uses;

    if (isDiscountLimitReached || isUserLimitReached || isListingLimitReached) {
      res.status(StatusCodes.CONFLICT).send("Discount code is not applicable");
    }

    if (Date.now() > discount.expirationDate) {
      res.status(StatusCodes.GONE).send("Code is no longer available");
    } else if (Date.now() < discount.startDate) {
      res.status(StatusCodes.FORBIDDEN).send("Code is not available yet");
    }

    const isEligible = await validateDiscount(context, code, "booking");
    if (isEligible) validDiscounts.push(code);
  }

  res.status(StatusCodes.OK).json({ validDiscounts: validDiscounts });
};

/*************CRITERIA*************/

export const getCriteria = async (req, res) => {
  const {
    query,
    numericFilters,
    projection,
    sort,
    page,
    offset,
    populate,
    count,
  } = req.query;

  const structureQuery = {
    ...(projection && { projection }),
    ...(page && offset && { pagination: { page, limit: offset } }),
    ...(sort && { sort }),
    ...(populate && { populate }),
  };

  const result = await buildQuery(Criteria, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });
  if (!result) {
    throw new async_errors.NotFoundError(
      "No criteria found that matched query terms"
    );
  }
  res.status(StatusCodes.OK).json({ result });
};

export const createCriterion = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Criteria, fields);
  res.status(StatusCodes.OK).json({ result });
};

export const getCriterion = async (req, res) => {
  const { id } = req.params;
  const lookUpId = new mongoose.Types.ObjectId(id);
  const result = await Criteria.aggregate([
    { $match: { _id: lookUpId } },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$parentCriteria",
        connectFromField: "parentCriteria",
        connectToField: "_id",
        as: "allParents",
        maxDepth: 10,
        depthField: "parentDepth",
      },
    },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$nestedCriteria",
        connectFromField: "nestedCriteria",
        connectToField: "_id",
        as: "allChildren",
        maxDepth: 10,
        depthField: "childDepth",
      },
    },
  ]);

  res.status(StatusCodes.OK).json(result);
};

export const createConfirmationToken = async (req, res) => {
  const { id } = req.params;
  const criterion = await Criteria.findById(id);
  if (!criterion) {
    throw new async_errors.NotFoundError(
      "No resource found in database with that ID. No confirmation token created"
    );
  }
  if (criterion.classification !== "instance_count")
    res.status(StatusCodes.NO_CONTENT).send();

  const stagedItems = await Criteria.aggregate([
    { $match: { _id: id } },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$parentCriteria",
        connectFromField: "parentCriteria",
        connectToField: "_id",
        as: "allParents",
        maxDepth: 10,
        depthField: "parentDepth", // Optional field to indicate depth
      },
    },

    // Fetch all child criteria recursively
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$nestedCriteria",
        connectFromField: "nestedCriteria",
        connectToField: "_id",
        as: "allChildren",
        maxDepth: 10,
        depthField: "childDepth", // Optional field to indicate depth
      },
    },
  ]);
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      { doc_id: id },
      TOKEN_SECRET,
      { expiresIn: 60 * 2 },
      (err, token) => {
        if (err) reject("JWT failed");
        resolve(token);
      }
    );
  });
  if (!token)
    throw new Error(
      "Failed to generate confirmation token. Please try again later."
    );

  res.cookie("delete_confirmation_token", token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 2 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    message:
      "Token successfully generated. By continuing with this operation, you will also be affecting the following criteria and possibly more.",
    stagedItems: stagedItems,
  });
};

export const deleteCriterion = async (req, res) => {
  const { id } = req.params;
  // Delete criteria that contai

  let deleted;
  const criterion = await Criteria.findById(id);
  if (!criterion) {
    throw new async_errors.NotFoundError(
      "No resource found in database with that ID"
    );
  }
  if (criterion.classification !== "instance_count")
    res.status(StatusCodes.NO_CONTENT).send();

  const confirmation = req.cookies.delete_criterion_confirmation;
  if (!confirmation) {
    throw new async_errors.UnauthorizedError("Confirmation missing");
  }

  jwt.verify(confirmation, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      throw new async_errors.UnauthorizedError(
        "Verification failed for this token"
      );
    if (decoded.doc_id !== id)
      throw new async_errors.UnauthorizedError(
        "Confirmatin token is not valid for this resource"
      );
    // Update nested and parent fields from perents and nested
    deleted = await Criteria.find(decoded.doc_id);
    Criteria.updateMany(
      { _id: { $in: criterion.parentCriteria } },
      { $pull: { nestedCriteria: criterion._id } }
    );
    Criteria.updateMany(
      { _id: { $in: criterion.nestedCriteria } },
      { $pull: { parentCriteria: criterion._id } }
    );
  });

  res.status(StatusCodes.OK).json({ deleted });
};

export const updateCriterion = async (req, res) => {
  const { id } = req.params;
  const { updateFields } = req.body;

  let updateObj = updateFields;
  if (updateFields.nestedCriteria && updateFields.nestedCriteria.pull) {
    updateObj.$pull = {
      nestedCriteria: { $in: updateFields.nestedCriteria.pull },
    };
    delete updateObj.nestedCriteria;
  }
  if (updateFields.parentCriteria && updateFields.parentCriteria.pull) {
    updateObj.$pull = {
      parentCriteria: { $in: updateFields.parentCriteria.pull },
    };
    delete updateObj.parentCriteria;
  }
  if (updateFields.nestedCriteria && updateFields.nestedCriteria.push) {
    updateObj.$push = {
      nestedCriteria: { $each: updateFields.nestedCriteria.push },
    };
    delete updateObj.nestedCriteria;
  }
  if (updateFields.parentCriteria && updateFields.parentCriteria.push) {
    updateObj.$push = {
      parentCriteria: { $each: updateFields.parentCriteria.push },
    };
    delete updateObj.parentCriteria;
  }

  const result = await Criteria.findOneAndUpdate({ _id: id }, updateObj, {
    new: true,
  });
  res.status(StatusCodes.OK).json(result);
};
