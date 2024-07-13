import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import Address from "../models/address.model.js";
import { createDocument } from "../libs/createDocument.js";
import * as async_erros from "../errors/errors.barrel.js";

export const getAddresses = async (req, res) => {
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

  const resultQuery = await buildQuery(Address, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json({ resultQuery });
};
export const getAddress = async (req, res) => {
  const { id } = req.params.id;
  const address = await Address.findById(id);
  res.status(StatusCodes.OK).json({ address });
};
export const postAddress = async (req, res) => {
  const fields = req.body;
  if (!fields.country || !fields.state || !fields.municipality || !fields.city)
    throw new async_erros.BadRequestError(
      "Fill out all fields before creating document"
    );
  const stateDoc = await State.findById(fields.state);
  if (stateDoc.country !== fields.country)
    throw async_erros.NotFoundError(
      `We couldn't find ${stateDoc.name} in that country`
    );
  const municipalityDoc = await Municipality.findById(fields.municipality);
  if (municipalityDoc.state !== fields.state)
    throw async_erros.NotFoundError(
      `We couldn't find ${municipalityDoc.name} in that state`
    );
  const cityDoc = await City.findById(fields.city);
  if (cityDoc.state !== fields.state)
    throw async_erros.NotFoundError(
      `We couldn't find ${cityDoc.name} in that country`
    );
  const result = await createDocument(Address, fields);

  res.status(StatusCodes.OK).json({ result });
};
export const updateAddress = async (req, res) => {
  const {} = req.body;
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const deleteAddress = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};

/* --------------------Countries-------------------- */

export const getCountries = async (req, res) => {
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

  const resultQuery = await buildQuery(Country, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json({ resultQuery });
};
export const getCountry = async (req, res) => {
  const { fields } = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const postCountry = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Country, fields);

  res.status(StatusCodes.OK).json({ result });
};
export const updateCountry = async (req, res) => {
  const {} = req.body;
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const deleteCountry = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};

/* --------------------States-------------------- */

export const getStates = async (req, res) => {
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

  const resultQuery = await buildQuery(State, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json({ resultQuery });
};
export const getState = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const postState = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(State, fields);

  res.status(StatusCodes.OK).json({ result });
};
export const updateState = async (req, res) => {
  const {} = req.body;
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const deleteState = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
/* --------------------Municipality-------------------- */

export const getMunicipalities = async (req, res) => {
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

  const resultQuery = await buildQuery(Municipality, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json({ resultQuery });
};
export const getMunicipality = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const postMunicipality = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Municipality, fields);

  res.status(StatusCodes.OK).json({ result });
};
export const updateMunicipality = async (req, res) => {
  const {} = req.body;
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const deleteMunicipality = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};

/* --------------------Cities-------------------- */

export const getCities = async (req, res) => {
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

  const resultQuery = await buildQuery(Address, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json({ resultQuery });
};
export const getCity = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const postCity = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(City, fields);

  res.status(StatusCodes.OK).json({ result });
};
export const updateCity = async (req, res) => {
  const {} = req.body;
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
export const deleteCity = async (req, res) => {
  const {} = req.params.id;
  res.status(StatusCodes.OK).json({});
};
