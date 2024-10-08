import * as async_errors from "../errors/errors.barrel.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../libs/createJWT.js";
import { s3, s3Name } from "../db/s3.client.js";
import {
  GetObjectCommand,
  NotFound,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { randomImageName } from "../libs/createID.js";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TOKEN_SECRET } from "../config.js";
import createReferralCode from "../libs/createReferalCode.js";
import queryDocs from "../libs/queryDocs.js";
import createDocument from "../libs/createDocument.js";

export const user = async (req, res) => {
  const { result: docs, messages } = await queryDocs(User, req.query);
  if (!docs) throw new async_errors.NotFoundError(messages.toString());

    return res.status(StatusCodes.OK).json({ result: docs });
  };

export const userDetails = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new NotFound("User not found in database");
  const queryParams = {
    Bucket: s3Name,
    Key: user.profile_image,
  };
  const command = new GetObjectCommand(queryParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 3 });
  const address = await Address.findOne({ user_id: id });
  const userInfo = { user, profile_image_url: url, address };
  res.status(StatusCodes.OK).json(userInfo);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new async_errors.BadRequestError(
      "Include both the email and password"
    );
  const userFound = await User.findOne({ email });
  if (!userFound)
    throw new async_errors.AuthenticationError("Verify email and password");

  const isMatch = await bcrypt.compare(password, userFound.password);
  if (!isMatch) {
    throw new async_errors.AuthenticationError("Verify email and password");
  }
  const token = await createAccessToken({ id: userFound._id });
  const listings = await Listing.find({ host_id: userFound._id });
  userFound.listings = listings || []; // Ensure it's an array
  res.cookie("token", token);
  return res.status(StatusCodes.OK).json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    profile_image: userFound.profile_image,
    listings: userFound.listings,
  });
};

export const logout = async (req, res) => {
  res.send("Hola");
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new async_errors.BadRequestError("Please fill out every field");
  }

  const buffer = await sharp(req.file.buffer) // Image uploaded thorugh multer
    .resize({ height: 500, width: 500, fit: "contain" })
    .toBuffer();

  const imageName = randomImageName();
  const params = {
    Bucket: s3Name,
    Key: imageName,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  const referralCode = createReferralCode(username);
  const user = {
    username,
    email,
    password: bcrypt.hashSync(
      password,
      await bcrypt.genSalt(10),
      (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          return hash;
        }
      }
    ),
    profile_image: imageName,
    referal_code: referralCode,
  };
  const newUser = await User.create(user);
  if (!newUser)
    throw new async_errors.UnprocessableError("Data for user unprocessable");
  const token = await createAccessToken({ id: newUser._id });
  res.cookie("token", token);
  res.status(StatusCodes.OK).json({
    id: newUser._id,
    username: newUser.username,
    profile_image: newUser.profile_image,
    email: newUser.email,
  });
};

export const deleteUser = async (req, res, next) => {
  User.findById(req.params.user_id, function (err, user) {
    Listing.deleteMany({ _id: { $in: user.listings } }, function (err) {
      if (err) return next(err);
      user.remove();
      res.status(StatusCodes.OK).send("user deleted succesfuly");
    });
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.status(StatusCodes.UNAUTHORIZED).send(false);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(StatusCodes.UNAUTHORIZED).send(false);
    return res.status(StatusCodes.OK).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profile_image: userFound.profile_image,
      listings: userFound.listings,
    });
  });
};

export const updateUser = async (req, res) => {
  const paths = Object.keys(User.schema.paths);
  const update = {};
  for (const key in req.body) {
    if (key in paths) {
      update[key] = req.body[key];
    } else {
      console.log(`property ${key} is not an valid path for this schema`);
    }
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.params.user_id },
    { update },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("Update failed");
  }
  res.status(StatusCodes.OK).json({ updatedUser });
};
