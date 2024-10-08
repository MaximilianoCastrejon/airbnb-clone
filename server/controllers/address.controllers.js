import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import Address from "../models/address.model.js";

export const getAddressess = async (req, res) => {
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

  const result = await buildQuery(Address, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });
  if (!result) {
    throw new async_errors.NotFoundError(
      "No address found that matched query terms"
    );
  }
  res.status(StatusCodes.OK).json({ result });
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
