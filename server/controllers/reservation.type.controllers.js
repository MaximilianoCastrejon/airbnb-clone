import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import createDocument from "../libs/createDocument.js";
import ReservationType from "../models/listings/reservation.type.model.js";
import queryDocs from "../libs/queryDocs.js";

export const getReservationTypes = async (req, res) => {
  const docs = await queryDocs(ReservationType, req.query);
  if (!docs)
    throw new async_errors.NotFoundError(
      "No reservation types matching the criteria"
    );
  res.status(StatusCodes.OK).json({ docs });
};
export const postReservationType = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(ReservationType, fields);
  res.status(StatusCodes.OK).json({ result });
};
export const updateReservationType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
};
