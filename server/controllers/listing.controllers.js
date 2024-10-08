import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { s3, s3Name } from "../db/s3.client.js";
import {
  GetObjectCommand,
  NotFound,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomImageName } from "../libs/createID.js";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Listing from "../models/listings/listing/listing.model.js";
import Review from "../models/listings/listing/review.model.js";
import User from "../models/user.model.js";
import { buildQuery } from "../libs/buildQuery.js";
import { createDocument } from "../libs/createDocument.js";
import DiscountCode from "../models/discount.code.model.js";
import Category from "../models/listings/category.model.js";
import checkDiscountValidity from "../libs/validateDiscount.js";

export const getListings = async (req, res) => {
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

  const quieriedListings = await buildQuery(Listing, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  // const getPriceInfo = async () => {
  //   const Listings = [];

  //   for (const Listing in quieriedListings) {
  //     query.listing_id = Listing._id;
  //     const priceInfo = await buildQuery(
  //       Price,
  //       query,
  //       numericFilters,
  //       structureQuery
  //     );
  //     Listings.push({
  //       ...Listing,
  //       ...priceInfo,
  //     });
  //   }
  //   return Listings;
  // };

  // const listings = await getPriceInfo();

  res.status(StatusCodes.OK).json({ quieriedListings });
};

export const getListing = async (req, res) => {
  const { id } = req.params;
  const resultListing = await Listing.findById(id);
  res.status(StatusCodes.OK).json({ resultListing });
};

export const postListing = async (req, res) => {
  const fields = req.body;

  const result = await createDocument(Listing, fields);
  res.status(StatusCodes.OK).json({ result });
};

export const deleteListing = async (req, res) => {
  const user = req.user;
  Listing;
  // Verify token to assure
  res.status(StatusCodes.OK).json({});
};

export const updateListing = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const getReviews = async (req, res) => {
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

  const result = await buildQuery(Review, {
    query: query,
    numericFilters: numericFilters,
    structure: structureQuery,
    count: count,
  });

  res.status(StatusCodes.OK).json(result);
};
export const getReview = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const postReview = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(Review, fields);

  res.status(StatusCodes.OK).json(result);
};
export const updateReview = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deleteReview = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

/*
{
    "__typename": "UserProfilePageReview",
    "createdAt": "2024-03-29T21:20:26.661Z",
    "comments": "Un lugar muy cómodo para quedarse con la familia. El lugar se encuentra a una distancia corta del centro y también tiene un abarrotes a dos o tres casas de distancia, lo cual lo vuelve un lugar muy atractivo para poder visitar distintos locales y para conseguir tus insumos para preparar tus comidas. Lo único que mejoraría sería la comunicación con el anfitrión ya que sí tardaba unas horas en contestar. Y también hubo un detalle con la cerradura electrónica que no fue resuelto al momento de la estadía.",
    "entityId": "864097020892007522",
    "entityType": "HOME",
    "id": "1123322076375102375",
    "isHostHighlight": false,
    "listing": {
        "__typename": "UserProfileReviewListing",
        "id": "864097020892007522",
        "localizedName": null,
        "name": "Departamento de lujo, céntrico, con mesa de billar",
        "pictureUrl": "https://a0.muscache.com/im/pictures/hosting/Hosting-864097020892007522/original/2e76fb16-549c-4354-b921-66b79dd320bd.jpeg?aki_policy=small"
    },
    "photos": [],
    "rating": 4,
    "response": null,
    "respondedAt": null,
    "reviewee": {
        "__typename": "UserProfileReviewUser",
        "id": "306582527",
        "createdAt": "2019-11-03T21:53:36.000Z",
        "isSuperhost": false,
        "location": "Mazamitla, México",
        "pictureUrl": "https://a0.muscache.com/im/pictures/user/User-306582527/original/f35c06da-1fd1-4878-85a8-f72d9d902ff3.jpeg?aki_policy=profile_x_medium",
        "smartName": "Javier"
    },
    "reviewer": {
        "__typename": "UserProfileReviewUser",
        "id": "379738118",
        "createdAt": "2020-12-12T01:00:05.000Z",
        "isSuperhost": false,
        "location": null,
        "pictureUrl": "https://a0.muscache.com/im/pictures/user/User-379738118/original/a1ad0661-f267-49bb-a567-c878f9a8059b.jpeg?aki_policy=profile_x_medium",
        "smartName": "Maximiliano"
    },
    "translation": {
        "__typename": "UserProfileReviewTranslation",
        "comments": "Un lugar muy cómodo para quedarse con la familia. El lugar se encuentra a una distancia corta del centro y también tiene un abarrotes a dos o tres casas de distancia, lo cual lo vuelve un lugar muy atractivo para poder visitar distintos locales y para conseguir tus insumos para preparar tus comidas. Lo único que mejoraría sería la comunicación con el anfitrión ya que sí tardaba unas horas en contestar. Y también hubo un detalle con la cerradura electrónica que no fue resuelto al momento de la estadía.",
        "commentsLanguage": "es",
        "disclaimer": "Traducido del español",
        "response": null,
        "responseDisclaimer": null,
        "responseLanguage": null
    }
}
*/

export const getReservationType = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const queryReservationTypes = async (req, res) => {
  const { result: docs, messages } = await queryDocs(
    ReservationType,
    req.query
  );
  if (!docs) throw new async_errors.NotFoundError(messages.toString());
  res.status(StatusCodes.OK).json({ result: docs });
};
export const createReservationType = async (req, res) => {
  const fields = req.body;
  const result = await createDocument(ReservationType, fields);

  res.status(StatusCodes.OK).json(result);
};
export const updateReservationType = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedReservationType = await ReservationType.findByIdAndUpdate(
id,
updates,
{
    new: true, // Return the updated document
    runValidators: true, // Validate updates against the model schema
  }
);

  if (!updatedReservationType) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ message: "ReservationType not found" });
  }
  res.status(StatusCodes.OK).json(updatedReservationType);
};
export const deleteReservationType = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await ReservationType.findByIdAndDelete(id);
  res.status(StatusCodes.OK).json({ message: "Deleted successfuly" });
};
