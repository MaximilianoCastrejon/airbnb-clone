import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3Name = process.env.S3_NAME;
const s3Region = process.env.S3_REGION;
const s3UserAccessKey = process.env.S3_USER_ACCESS_KEY;
const s3UserSecretAccessKey = process.env.S3_USER_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: s3UserAccessKey,
    secretAccessKey: s3UserSecretAccessKey,
  },
  region: s3Region,
});
