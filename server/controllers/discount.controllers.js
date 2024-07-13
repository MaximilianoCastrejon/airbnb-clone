import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { s3, s3Name } from "../db/s3.client.js";
import {
  GetObjectCommand,
  NotFound,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomImageName } from "../libs/createID.js";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Listing from "../models/listings/listing/listing.model.js";
import Review from "../models/listings/listing/review.model.js";
import User from "../models/user.model.js";
import { buildQuery } from "../libs/buildQuery.js";
import { createDocument } from "../libs/createDocument.js";
import DiscountCode from "../models/discount.code.model.js";
import Category from "../models/listings/category.model.js";
import checkDiscountValidity from "../libs/validateDiscount.js";

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
  res.status(StatusCodes.OK).json({});
};
export const deleteDiscount = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const checkListingDiscountValidity = async (req, res) => {
  const { id } = req.params;
  const { discountCode } = req.query;

  const context = await Listing.findById(id);
  const discountId = await DiscountCode.findOne({ code: discountCode });

  const isListingEligible = await checkDiscountValidity(context);
  res.status(StatusCodes.OK).json({});
};

/*************USER*************/

export const getUserCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const createUserCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const getUserCriteria = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const deleteUserCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const updateUserCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

/*************LISTING*************/
export const getListingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const createListingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const getListingCriteria = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const deleteListingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const updateListingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

/*************BOOKING*************/
export const getBookingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const createBookingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const getBookingCriteria = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const deleteBookingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const updateBookingCriterion = (req, res) => {
  res.status(StatusCodes.OK).json({});
};
