import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import User from "../models/user.model.js";
import DiscountCode from "../models/discount.code.model.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import ListingDiscountCode from "../models/listing.discount.model.js";
import mongoose from "mongoose";
import queryDocs from "../libs/queryDocs.js";

export const getDiscounts = async (req, res) => {
  const { result, messages } = await queryDocs(DiscountCode, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
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
  const { id } = req.params;
  const deleted = await DiscountCode.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json(deleted);
};

export const getUserCodes = async (req, res) => {
  const { result, messages } = await queryDocs(User, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};

export const createUserCode = async (req, res) => {
  const { id, discountCodeId } = req.body;
  const discountAdded = await createDocument(UserDiscountCode, {
    user_id: id,
    discount_code_id: discountCodeId,
  });

  if (!discountAdded) {
    throw new Error(
      "Discount code could not be added for this user. Try again later"
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Item successfully created", discountAdded });
};

export const deleteUserCode = async (req, res) => {
  const { id } = req.params;
  const deleted = await UserDiscountCode.findByIdAndDelete(id);
  if (!deleted)
    throw new async_errors.NotFoundError("Item could not be found in database");
  res.status(StatusCodes.OK).send("Item successfully deleted");
};

export const getListingCodes = async (req, res) => {
  const docs = await queryDocs(ListingDiscountCode, req.query);
  if (!docs) throw new async_errors.NotFoundError("No listing codes found");
  res.status(StatusCodes.OK).json({ docs });
};

export const createListingCode = async (req, res) => {
  const { id, discountCodeId } = req.body;
  const discountAdded = await createDocument(ListingDiscountCode, {
    user_id: id,
    discount_code_id: discountCodeId,
  });

  if (!discountAdded) {
    throw new Error(
      "Discount code could not be added for this listing. Try again later"
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Item successfully created", discountAdded });
};

export const deleteListingCode = async (req, res) => {
  const { id } = req.params;
  const deleted = await ListingDiscountCode.findByIdAndDelete(id);
  if (!deleted)
    throw new async_errors.NotFoundError("Item could not be found in database");
  res.status(StatusCodes.OK).send("Item successfully deleted");
};
