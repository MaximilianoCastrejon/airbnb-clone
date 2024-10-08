import { StatusCodes } from "http-status-codes";
import * as async_errors from "../errors/errors.barrel.js";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import Currency from "../models/currency.model.js";

export const getCurrencies = async (req, res) => {
  const { result, messages } = await queryDocs(Currency, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
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
