import mongoose from "mongoose";

/**
 * Function to query all documents that fit search terms in params.
 * @param {mongoose.Schema} schema - Mongoose schema.
 * @param {Object} options - Object containing options for querying documents.
 * @param {string} [options.query] - query = '{"property_A":true, "property_B":"value B", "property_C":["value_C", "value_D"]}' (optional).
 * @param {string} [options.numericFilters] - numericFilters = "property_A>2000,property_B>2,createdAt>2023-04-01,createdAt<2023-04-10" Dates = yyyy-mm-dd (optional).
 * @param {boolean} [options.count=false] - Flag to indicate whether to return only the count.
 * @param {{ projection: String, sort: String, pagination: {page: Number, offset: Number}, populate: String }} [options.structure] - Structure how your resulting documents will look like
 *     - projection: A string representing projection fields.
 *     - sort: A string representing sort criteria.
 *     - pagination: An object with page and offset properties.
 *     - populate: A string representing fields to populate.
 *   Example usage:
 *     {
 *       projection: "property_A,property_B,property_C",
 *       sort: "-property_A,property_B,-property_C",
 *       pagination: { page: 3, offset: 20 },
 *       populate: "property_A,property_B,property_C"
 *     }
 * - (optional).
 *  *
 * @param {string} [options.structure.sort] - Sort criteria.
 * @param {Object} [options.structure.pagination] - Pagination options.
 * @param {number} [options.structure.pagination.page] - Page number.
 * @param {number} [options.structure.pagination.offset] - Offset.
 * @param {string} [options.structure.populate] - Fields to populate.
 * @returns {Array|number} - If count is true, returns the count of matching documents, otherwise returns an array of documents.
 */
export const buildQuery = async (
  schema,
  { query, numericFilters, structure, count = false }
) => {
  const processedQuery = {};

  const stringPaths = Object.keys(schema.schema.paths).filter(
    (path) => schema.schema.paths[path].instance === "String"
  );
  const arrayPaths = Object.keys(schema.schema.paths).filter(
    // Exact match
    (path) => schema.schema.paths[path].instance === "Array"
  );
  const numberPaths = Object.keys(schema.schema.paths).filter(
    (path) => schema.schema.paths[path].instance === "Number"
  );
  const objectIDPaths = Object.keys(schema.schema.paths).filter(
    (path) => schema.schema.paths[path].instance === "ObjectId"
  );
  const booleanPaths = Object.keys(schema.schema.paths).filter(
    (path) => schema.schema.paths[path].instance === "Boolean"
  );

  if (numericFilters) {
    const numeric_query_arr = mapOperators(numericFilters).split(",");
    // numericFilters = "price>2000,rooms>2,createdAt>2023-04-01,createdAt<2023-04-10"
    // mapOperators(numericFilters) = ["price>2000","rooms>2","createdAt>2023-04-01","createdAt<2023-04-10"]
    // queryItem = ["price_$gt_2000","rooms_$gt_2","createdAt_$gt_2023-04-01","createdAt_$lt_2023-04-10"]
    for (const queryItem of numeric_query_arr) {
      // queryItem = "price_$gt_2000"
      let [field, operator, filterValue] = queryItem.split("_");
      if (numberPaths.includes(field)) {
        if (field === "createdAt") {
          operator === ">"
            ? (filterValue = new Date(filterValue).setUTCHours(0, 0, 0, 0))
            : (filterValue = new Date(filterValue).setUTCHours(
                23,
                59,
                59,
                999
              ));
        } else {
          filterValue = Number(filterValue);
        }
        processedQuery[field] = { [operator]: filterValue };
      }
    }
  }

  // query = {"result":true, "count":42}
  if (query) {
    const decodedQuery = decodeURIComponent(query);
    const userQuery = await JSON.parse(decodedQuery);
    for (const key in userQuery) {
      if (Array.isArray(userQuery[key]) && arrayPaths.includes(key)) {
        console.log(arrayPaths);
        processedQuery[key] = { $in: userQuery[key] }; // Exact match
      } else if (stringPaths.includes(key)) {
        const regexPattern = new RegExp(userQuery[key], "is");
        processedQuery[key] = regexPattern;
      } else if (arrayPaths.includes(key)) {
        processedQuery[key] = userQuery[key];
      } else if (objectIDPaths.includes(key)) {
        processedQuery[key] = userQuery[key];
      } else if (booleanPaths.includes(key)) {
        processedQuery[key] = userQuery[key];
      }
    }
  }

  let result = schema.find(processedQuery);
  if (count) return await result.countDocuments();

  const { projection, sort, pagination, populate } = structure;

  if (projection) {
    const show = projection.split(",").join(" ");
    result = result.select(show);
  }
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (pagination) {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;

    // Solutions: Use two queries || use a function inbetween facets of the pipeline to get totalDocuments
    const totalDocuments = await schema.countDocuments(processedQuery);
    const totalPages =
      Math.ceil(totalDocuments / limit) === 0
        ? 1
        : Math.ceil(totalDocuments / limit);

    const toPage =
      limit * (page <= totalPages ? (page < 1 ? 0 : page - 1) : totalPages - 1);
    result = result.skip(toPage).limit(limit);
    return result;
  }

  if (populate) {
    const pop = populate
      .split(",")
      .forEach((item) => {
        if (objectIDPaths.includes(item)) {
          return item;
        }
        return "";
      })
      .join(" ");
    result = result.populate(pop);
  }
  const orderedResult = await result;

  // Return the built query
  return orderedResult;
};

function mapOperators(numericFilters) {
  const operatorMap = {
    ">": "$gt",
    ">=": "$gte",
    "=": "$eq",
    "<": "$lt",
    "<=": "$lte",
  };
  const filterOperator = /\b(<|<=|=|>=|>)\b/g;
  let filters = numericFilters.replace(
    filterOperator,
    (operator) => `_${operatorMap[operator]}_`
  );
  return filters;
}

/* 
Give option for range processedQuery.createdAt: { $gte: period.from, $lte: period.to }
if (numQuery) {
    let filters = mapOperators(numQuery);
    const from_fields = new Set();
    filters.split(",").forEach((item) => {
      const [field, operator, filterValue] = item.split("_");
      if (numQuery.options.includes(field)) {
        let castedFilterValue = castNumericValue(field, filterValue);
        // If appeard before
        if (from_fields.has(field)) {
          if (field === "createdAt") {
            castedFilterValue.setUTCHours(23, 59, 59, 999);
          }
          processedQuery[field] = {
            ...processedQuery[field],
            [operator]: castedFilterValue,
          };
        } else {
          //how can I send two dates in my req.query
          processedQuery[field] = { [operator]: castedFilterValue };
        }
        
        from_fields.add(field);
      }
    });
  }
  */

/*
if (stringParams) {
  stringParams.forEach((obj) => {
    Object.entries(obj).forEach(([key, value]) => {
        console.log("[key, value]", [key, value]);
        const match = key.match(/(.*)Options/);
        if (match) {
          const field = match[1];
          processedQuery[field] = { $regex: obj[field] };
          if (key.endsWith("Options")) {
            processedQuery[field]["$options"] = value ? value : "";
          }
        }
      });
    });
  }
  */

// function castNumericValue(field, filterValue) {
//   let castedFilterValue = filterValue;
//   if (field === "createdAt") {
//     castedFilterValue = new Date(castedFilterValue);
//     castedFilterValue.setUTCHours(0, 0, 0, 0);
//   } else if (field !== "createdAt") {
//     castedFilterValue = Number(castedFilterValue);
//   }
//   return castedFilterValue;
// }
