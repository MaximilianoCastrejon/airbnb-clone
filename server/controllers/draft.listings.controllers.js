import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import DraftListing from "../models/listings/draft-listings/listing.model.js";
import createDocument from "../libs/createDocument.js";
import ListingPhoto from "../models/listings/listing/photo.model.js";
import Address from "../models/address.model.js";
import DraftAddress from "../models/listings/draft-listings/address.model.js";
import Listing from "../models/listings/listing/listing.model.js";
import DraftListingPhoto from "../models/listings/draft-listings/photo.model.js";

export const getDraftListings = async (req, res) => {
  const { result, messages } = await queryDocs(DraftListing, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};

export const getDraftListing = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const postDraftListing = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const updateDraftListing = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const deleteDraftListing = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const postFinalDraft = async (req, res) => {
  const { draft_listing_id } = req.params.id;
  const draftListing = await DraftListing.findById(draft_listing_id);
  const draftAddress = await DraftAddress.findById(draft.address);

  const result = {};
  const finalAddress = await createDocument(Address, draftAddress);
  draftListing.address = finalAddress._id;
  const finalListing = await createDocument(Listing, draftListing);

  const draftPhotos = await DraftListingPhoto.find({
    listing_id: draft_listing_id,
  });
  if (draftPhotos.lenght < 5) {
    throw new async_errors.BadRequestError(
      "Not enough photos have been added for your listing. A minimum of 5 are required"
    );
  }
  for (const photo of draftPhotos) {
    const finalPhoto = photo;
    finalPhoto.listing_id = finalListing._id;
    const newPhoto = await createDocument(ListingPhoto, finalPhoto);
    DraftListingPhoto.findByIdAndDelete(photo._id);
  }
  // Delete drafts
  DraftAddress.findByIdAndDelete(draftListing.address);
  DraftListing.findByIdAndDelete(draft_listing_id);
  result.listing = finalListing;
  result.address = finalAddress;
  result.photos = finalListing;
  res.status(StatusCodes.OK).json({ final });
};

export const postDraftPhoto = async (req, res) => {
  const buffer = await sharp(req.file.buffer) // Image uploaded thorugh multer
    .resize({ height: 500, width: 500, fit: "contain" })
    .toBuffer();
  const imageName = randomImageName();
};
