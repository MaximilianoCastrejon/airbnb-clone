import { StatusCodes } from "http-status-codes";
import * as async_errors from "../errors/errors.barrel.js";
import { s3, s3Name } from "../db/s3.client.js";
import {
  GetObjectCommand,
  NotFound,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomImageName } from "../libs/createID.js";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ListingPhoto from "../models/listings/listing/photo.model.js";
import createDocument from "../libs/createDocument.js";
/*---------------------Photos---------------------*/
export const getPhotos = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const getPhoto = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};

export const postPhoto = async (req, res) => {
  const fields = req.body;
  const files = req.files;
  const result = [];

  const createPhoto = {};
  // const orderedFiles = files.sort((file_a, file_b) => {
  //   const aPosition = parseInt(file_a.originalname.split("_")[1]); // "file_1"
  //   const bPosition = parseInt(file_b.originalname.split("_")[1]); // "file_2"
  //   return aPosition - bPosition;
  // });
  files.forEach(async (file, index) => {
    const buffer = await sharp(file)
      .resize({ height: 720, width: 1280, fit: sharp.fit.cover })
      .toBuffer();

    const imageName = randomImageName();
    const params = {
      Bucket: s3Name,
      Key: imageName,
      body: buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    // TODO: Separate document information by file name
    createPhoto = `fields.file_${index}`;
    createPhoto.placement = index;

    // const newPhoto = await createDocument(ListingPhoto, createPhoto);
    // result.push(newPhoto);
    if (file) {
      console.log(
        `File ${index + 1} (Order: ${file.originalname}):`,
        file.originalname
      );
    }
  });

  res.status(StatusCodes.OK).json({ result });
};
export const updatePhoto = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
export const deletePhoto = async (req, res) => {
  res.status(StatusCodes.OK).json({});
};
