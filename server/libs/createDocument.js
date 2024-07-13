import mongoose from "mongoose";
import * as async_errors from "../errors/errors.barrel.js";

/**
 * Creates documents and evaluates every required field is inccluded
 * @param {mongoose.Schema} model
 * @param {Object} fields
 * @returns {Object}
 */
export const createDocument = async (model, fields) => {
  for (const field of Object.keys(fields)) {
    if (typeof field !== "string")
      throw new async_errors.BadRequestError(`Key "${field}" is not a string`);
    typeof fields[field] === "string"
      ? (fields[field] = fields[field].trim())
      : null;
  }
  const required_fields = Object.keys(model.schema.paths).filter(
    (path) => model.schema.paths[path].isRequired === true
  );

  const missingFields = required_fields.filter(
    (field) => !fields.hasOwnProperty(field)
  );

  if (missingFields.length > 0) {
    // Respond with an error indicating the missing fields
    throw new async_errors.BadRequestError(
      `You must have completed all of the required fields before creating the document/nRequired fields: ${required_fields}`
    );
  }

  // Check all ObjectId fields do exist in their respective models
  const objectIdFields = Object.keys(model.schema.paths).filter(
    (path) => model.schema.paths[path].instance === "ObjectId"
  );

  for (const field of objectIdFields) {
    if (fields[field]) {
      const refModelName = model.schema.paths[field].options.ref;
      const refModel = mongoose.model(refModelName);
      const refDoc = await refModel.findById(fields[field]);
      if (!refDoc) {
        throw new async_errors.BadRequestError(
          `Invalid reference for ${field}: No document found in ${refModelName} with id ${fields[field]}`
        );
      }
    }
  }

  const document = await model.create(fields);
  if (!document)
    throw new Error(`${model} document was not successfully created`);

  return document;
};
