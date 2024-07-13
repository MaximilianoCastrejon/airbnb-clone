import { StatusCodes } from "http-status-codes";
import * as async_errors from "../errors/errors.barrel.js";
import { buildQuery } from "../libs/buildQuery.js";
import { createDocument } from "../libs/createDocument.js";
import Currency from "../models/currency.model.js";

export const getCurrencies = async (req, res) => {
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

  const result = await buildQuery(Currency, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json(result);
};
export const getCurrency = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const postCurrency = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Currency, fields);
  res.status(StatusCodes.OK).json(result);
};
export const updateCurrency = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deleteCurrency = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
