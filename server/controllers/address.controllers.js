import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import Address from "../models/address.model.js";

export const getAddressess = async (req, res) => {
  const { result, messages } = await queryDocs(Address, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};
export const getAddressDetails = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const createAddress = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(Address, fields);
  res.status(StatusCodes.OK).json({ result });
};
export const updateAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deleteAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
