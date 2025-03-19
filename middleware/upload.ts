import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Cấu hình chung cho multer
const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase()) &&
  /jpeg|jpg|png/.test(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only accept image file (jpeg, jpg, png)"));
};

// Middleware cho upload 1 ảnh (field 'image')
export const uploadSingleImage = multer({
  storage,
  fileFilter,
}).single("image");

// Middleware cho upload nhiều ảnh (checkInImage, checkOutImage)
export const uploadMultipleImages = multer({
  storage,
  fileFilter,
}).fields([
  { name: "checkInImage", maxCount: 1 },
  { name: "checkOutImage", maxCount: 1 },
]);

// Wrapper cho middleware
export const singleImageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploadSingleImage(req, res, (err) => (err ? next(new Error(err.message)) : next()));
};

export const multipleImagesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploadMultipleImages(req, res, (err) => (err ? next(new Error(err.message)) : next()));
};