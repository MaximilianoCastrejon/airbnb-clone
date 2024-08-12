import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { createDocument } from "../libs/createDocument.js";
import Category from "../models/listings/category.model.js";
import { buildQuery } from "../libs/buildQuery.js";

export const getCategories = async (req, res) => {
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
  // query = '{"result":true, "count":42}'
  const structureQuery = {
    ...(projection && { projection }),
    ...(page && offset && { pagination: { page, limit: offset } }),
    ...(sort && { sort }),
    ...(populate && { populate }),
  };

  const result = buildQuery(Category, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });
  if (!result) {
    throw new async_errors.NotFoundError(
      "No categories found that matched the criteria"
    );
  }
  res.status(StatusCodes.OK).json(result);
};
export const postCategory = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(Category, fields);
  res.status(StatusCodes.OK).json({ result });
};
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
};
