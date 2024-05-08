import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";

const postCategory = async (req, res) => {
  const { name, description } = req.body;
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
};
