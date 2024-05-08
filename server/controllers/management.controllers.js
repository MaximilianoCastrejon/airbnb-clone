import Listing from "../models/properties/listings/listing.model.js";
import { StatusCodes } from "http-status-codes";
import * as async_errors from "../errors/errors.barrel.js";

export const getReport = async (req, res) => {
  const { user_id } = req.params;
  const userProperties = await Listing.find({ user_id: user_id });
  if (!userProperties) {
    throw async_errors.NotFoundError("No properties found under this user");
  }
  res.status(StatusCodes.OK).json({ userProperties });
};
