import { buildQuery } from "./buildQuery.js";
import * as async_errors from "../errors/errors.barrel.js";
import mongoose from "mongoose";

/**
 * Executes a query on the provided Mongoose model with optional filters, projections, sorting, pagination,
 * and population of related documents. Returns the resulting documents and any messages generated during the query.
 *
 * @async
 * @param {mongoose.Model} model - The Mongoose model to query.
 * @param {Object} queryParams - Parameters for the query.
 * @param {Object} [queryParams.query] - MongoDB query filters.
 * @param {Object} [queryParams.numericFilters] - Numeric-based filters for the query (e.g., price, rating).
 * @param {Object} [queryParams.projection] - Fields to include or exclude from the returned documents.
 * @param {Object} [queryParams.sort] - Sorting criteria (e.g., { -createdAt }).
 * @param {number} [queryParams.page] - The current page number for pagination.
 * @param {number} [queryParams.limit] - The number of results per page for pagination.
 * @param {string|Array<string>} [queryParams.populate] - Fields to populate with related documents.
 * @param {boolean} [queryParams.count] - If true, returns the total count of documents matching the query.
 *
 * @returns {Promise<{result: Object|number, messages: string[]}>} - An object containing the result (documents or count)
 * and any messages generated during the query.
 *
 * @throws {NotFoundError} - Throws if no results are found that match the query terms.
 *
 * @example
 * const queryParams = {
 *   query: { status: 'active' },
 *   numericFilters: { price: { $gte: 10 } },
 *   projection: { name: 1, price: 1 },
 *   sort: { createdAt: -1 },
 *   page: 1,
 *   limit: 20,
 *   populate: 'user',
 *   count: false
 * };
 *
 * const { result, messages } = await queryDocs(ProductModel, queryParams);
 */
const queryDocs = async (model, queryParams) => {
  const {
    query,
    numericFilters,
    projection,
    sort,
    page,
    limit,
    populate,
    count,
  } = queryParams;

  const structureQuery = {
    ...(projection && { projection }),
    ...(page && limit && { pagination: { page, limit: limit } }),
    ...(sort && { sort }),
    ...(populate && { populate }),
  };
  try {
    const [result, messages] = await buildQuery(model, {
      query: query,
      numericFilters: numericFilters,
      structure: structureQuery,
      count: count,
    });
    if (!result || result <= 0) {
      throw new async_errors.NotFoundError(
        "No results that matched query terms were found"
      );
    }
    return { result, messages };
  } catch (error) {
    throw error;
  }
};
export default queryDocs;
