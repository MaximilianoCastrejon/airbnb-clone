import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import { createDocument } from "../libs/createDocument.js";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
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

  const result = await buildQuery(User, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });
  if (!result) {
    throw new async_errors.NotFoundError(
      "No user found that matched query terms"
    );
  }
  res.status(StatusCodes.OK).json({ result });
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
