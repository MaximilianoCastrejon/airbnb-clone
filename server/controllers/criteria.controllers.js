import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import createDocument from "../libs/createDocument.js";
import Criteria from "../models/criteria.model.js";
import mongoose from "mongoose";

export const getCriteria = async (req, res) => {
  const { result, messages } = await queryDocs(Criteria, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};

export const createCriterion = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Criteria, fields);
  res.status(StatusCodes.OK).json({ result });
};

export const getCriterion = async (req, res) => {
  const { id } = req.params;
  const lookUpId = new mongoose.Types.ObjectId(id);
  const result = await Criteria.aggregate([
    { $match: { _id: lookUpId } },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$parentCriteria",
        connectFromField: "parentCriteria",
        connectToField: "_id",
        as: "allParents",
        maxDepth: 10,
        depthField: "parentDepth",
      },
    },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$nestedCriteria",
        connectFromField: "nestedCriteria",
        connectToField: "_id",
        as: "allChildren",
        maxDepth: 10,
        depthField: "childDepth",
      },
    },
  ]);

  res.status(StatusCodes.OK).json(result);
};

export const createConfirmationToken = async (req, res) => {
  const { id } = req.params;
  const criterion = await Criteria.findById(id);
  if (!criterion) {
    throw new async_errors.NotFoundError(
      "No resource found in database with that ID. No confirmation token created"
    );
  }
  if (criterion.classification !== "instance_count")
    res.status(StatusCodes.NO_CONTENT).send();

  const stagedItems = await Criteria.aggregate([
    { $match: { _id: id } },
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$parentCriteria",
        connectFromField: "parentCriteria",
        connectToField: "_id",
        as: "allParents",
        maxDepth: 10,
        depthField: "parentDepth", // Optional field to indicate depth
      },
    },

    // Fetch all child criteria recursively
    {
      $graphLookup: {
        from: "criterias",
        startWith: "$nestedCriteria",
        connectFromField: "nestedCriteria",
        connectToField: "_id",
        as: "allChildren",
        maxDepth: 10,
        depthField: "childDepth", // Optional field to indicate depth
      },
    },
  ]);
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      { doc_id: id },
      TOKEN_SECRET,
      { expiresIn: 60 * 2 },
      (err, token) => {
        if (err) reject("JWT failed");
        resolve(token);
      }
    );
  });
  if (!token)
    throw new Error(
      "Failed to generate confirmation token. Please try again later."
    );

  res.cookie("delete_confirmation_token", token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 2 * 60 * 1000,
  });
  // TODO: Query codes with criteria matching ids in parents, children, and original
  // to set staged codes to be affected
  res.status(StatusCodes.OK).json({
    message:
      "Token successfully generated. By continuing with this operation, you will also be affecting the following criteria and possibly more.",
    stagedItems: stagedItems,
  });
};

export const deleteCriterion = async (req, res) => {
  const { id } = req.params;
  // Delete criteria that contai

  let deleted;
  const criterion = await Criteria.findById(id);
  if (!criterion) {
    throw new async_errors.NotFoundError(
      "No resource found in database with that ID"
    );
  }
  if (criterion.classification !== "instance_count")
    res.status(StatusCodes.NO_CONTENT).send();

  const confirmation = req.cookies.delete_criterion_confirmation;
  if (!confirmation) {
    throw new async_errors.UnauthorizedError("Confirmation missing");
  }

  jwt.verify(confirmation, process.env.JWT_SECRET, async (err, decoded) => {
    if (err)
      throw new async_errors.UnauthorizedError(
        "Verification failed for this token"
      );
    if (decoded.doc_id !== id)
      throw new async_errors.UnauthorizedError(
        "Confirmatin token is not valid for this resource"
      );
    // Update nested and parent fields from perents and nested
    deleted = await Criteria.find(decoded.doc_id);
    Criteria.updateMany(
      { _id: { $in: criterion.parentCriteria } },
      { $pull: { nestedCriteria: criterion._id } }
    );
    Criteria.updateMany(
      { _id: { $in: criterion.nestedCriteria } },
      { $pull: { parentCriteria: criterion._id } }
    );
  });

  res.status(StatusCodes.OK).json({ deleted });
};

export const updateCriterion = async (req, res) => {
  const { id } = req.params;
  const { updateFields } = req.body;

  let updateObj = updateFields;
  if (updateFields.nestedCriteria && updateFields.nestedCriteria.pull) {
    updateObj.$pull = {
      nestedCriteria: { $in: updateFields.nestedCriteria.pull },
    };
    delete updateObj.nestedCriteria;
  }
  if (updateFields.parentCriteria && updateFields.parentCriteria.pull) {
    updateObj.$pull = {
      parentCriteria: { $in: updateFields.parentCriteria.pull },
    };
    delete updateObj.parentCriteria;
  }
  if (updateFields.nestedCriteria && updateFields.nestedCriteria.push) {
    updateObj.$push = {
      nestedCriteria: { $each: updateFields.nestedCriteria.push },
    };
    delete updateObj.nestedCriteria;
  }
  if (updateFields.parentCriteria && updateFields.parentCriteria.push) {
    updateObj.$push = {
      parentCriteria: { $each: updateFields.parentCriteria.push },
    };
    delete updateObj.parentCriteria;
  }

  const result = await Criteria.findOneAndUpdate({ _id: id }, updateObj, {
    new: true,
  });
  res.status(StatusCodes.OK).json(result);
};
