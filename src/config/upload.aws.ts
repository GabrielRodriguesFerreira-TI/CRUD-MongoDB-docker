import "dotenv/config";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { AppError } from "../errors/erros";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const s3 = new S3Client({
  region: "sa-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "crud-mongodb-desenvolvimento",
    acl: "public-read",
    metadata: function (req: Request, file: Express.Multer.File, cb: Function) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: Request, file: Express.Multer.File, cb: Function) {
      cb(null, new Date().toISOString() + "-" + file.originalname);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  fileFilter: function (req: Request, file: Express.Multer.File, cb: Function) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new AppError("Only image files are allowed!", 400));
    }
    cb(null, true);
  },
});
