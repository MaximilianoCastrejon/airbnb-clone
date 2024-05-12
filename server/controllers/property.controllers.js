import * as async_errors from "../errors/errors.barrel.js";
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
import Price from "../models/listings/listing/price.model.js";
import User from "../models/user.model.js";

export const getListings = async (req, res) => {
  const {
    name,
    nameOptions,
    description,
    descriptionOptions,
    category,
    subcategory,
    country,
    state,
    city,
    user_id,
    address,
    latitude,
    longitude,
    bedroom_count,
    bed_count,
    pna_bathroom_count,
    dedicated_bathroom_count,
    shared_bathroom_count,
    accomodates_count,
    availability_type,
    start_date,
    refund_type,
    checkInTime,
    checkOutTime,
    numericFilters,
    projection,
    sort,
    page,
    offset,
  } = req.query;

  const queryObject = {};
  const numQuery = {};
  const idFields = [];
  const structureQuery = {};
  /* Query params */

  const stringParams = [];
  const fields = [
    { name: "name", value: name, options: nameOptions },
    { name: "description", value: description, options: descriptionOptions },
  ];

  for (const field of fields) {
    if (field.value) {
      stringParams.push({
        [field.name]: field.value,
        [`${field.name}Options`]: field.options,
      });
    }
  }
  if (user_id) {
    idFields.push({ id: user_id, fieldName: "user_id" });
  }
  /* Structure */
  if (projection) {
    structureQuery.projection = projection;
  }
  if (page && offset) {
    structureQuery.pagination = { page: page, limit: offset };
  }
  if (sort) {
    structureQuery.sort = sort;
  }

  /* String and num objects to build query*/

  if (stringParams.length > 0) {
    queryObject.stringParams = stringParams;
  }

  if (numericFilters) {
    numQuery.numericFilters = numericFilters;
    numQuery.options = [];
  }
  if (idFields.length !== 0) {
    queryObject.idFields = idFields;
  }
  if (Object.keys(numQuery).length !== 0) {
    queryObject.numQuery = numQuery;
  }
  const Listings = await buildQuery(Listing, queryObject, structureQuery);

  const getPriceInfo = async () => {
    const Listings = [];

    for (const Listing in Listings) {
      const priceInfo = await Price.findOne({ Listing_id: Listing._id });
      Listings.push({
        ...Listing,
        ...priceInfo,
      });
    }
    return Listings;
  };

  const listings = await getPriceInfo();

  res.status(StatusCodes.OK).json({ listings });
};

export const getListing = async (req, res) => {
  const { id } = req.params;
  const Listing = await Listing.findById(id);
  res.status(StatusCodes.OK).json({ Listing });
};

export const postListing = async (req, res) => {
  const required_fields = [
    "name",
    "description",
    "category",
    "subcategory",
    "country",
    "state",
    "city",
    "user_id",
    "address",
    "latitude",
    "longitude",
    "bedroom_count",
    "bed_count",
    "pna_bathroom_count",
    "dedicated_bathroom_count",
    "shared_bathroom_count",
    "accomodates_count",
    "availability_type",
    "start_date",
    "refund_type",
    "checkInTime",
    "checkOutTime",
  ];

  const fields = req.body;

  const missingFields = required_fields.filter(
    (field) => !fields.hasOwnListing(field)
  );

  if (missingFields.length > 0) {
    // Respond with an error indicating the missing fields
    throw new async_errors.BadRequestError(
      "You must have completed all of the required fields before finishing your listing"
    );
  }

  const Listing = await Listing.create(fields);
  User.updateOne({ _id: fields.user_id }, { $push: { listings: Listing._id } });
  res.status(StatusCodes.OK).json({ response: Listing });
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
  res.status(StatusCodes.OK).json({});
};
export const getReview = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const postReview = async (req, res) => {
  const required_fields = [
    "createdAt",
    "comments",
    "entityId",
    "subcategory",
    "isHostHighlight",
    "listing",
  ];
  res.status(StatusCodes.OK).json({});
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
