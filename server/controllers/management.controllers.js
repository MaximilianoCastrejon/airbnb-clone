import Listing from "../models/listings/listing/listing.model.js";
import { StatusCodes } from "http-status-codes";
import * as async_errors from "../errors/errors.barrel.js";

export const getReport = async (req, res) => {
  const { user_id } = req.params;
  const userListings = await Listing.find({ user_id: user_id });
  if (!userListings) {
    throw async_errors.NotFoundError("No listings found under this user");
  }
  res.status(StatusCodes.OK).json({ userListings });
};
