import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  const { result, messages } = await queryDocs(User, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};
export const getUserDetails = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const createUser = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(User, fields);
  res.status(StatusCodes.OK).json({ result });
};
export const updateUser = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deleteUser = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const getUserAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const createUserAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const updateUserAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deleteUserAddress = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
