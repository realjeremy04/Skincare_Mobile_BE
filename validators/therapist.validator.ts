import { body, param } from "express-validator";

export const therapistValidation = [
  body("accountId").isMongoId().withMessage("Invalid account ID"),

  body("specialization")
    .isArray({ min: 1 })
    .withMessage("Specialization must be a non-empty array"),

  body("specialization.*")
    .isMongoId()
    .withMessage("Invalid specialization ID"),

  body("certification")
    .isArray({ min: 1 })
    .withMessage("Certification must be a non-empty array"),

    body("certification.*.name")
    .isString()
    .notEmpty()
    .withMessage("Certification name is required")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Certification name must only contain letters and spaces"),

  body("certification.*.issuedBy")
    .isString()
    .notEmpty()
    .withMessage("Certification issuer is required")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Certification issuer must not contain special characters"),

  body("certification.*.issuedDate")
    .isISO8601()
    .withMessage("Invalid issued date format"),

  body("experience")
    .isString()
    .notEmpty()
    .withMessage("Experience is required"),
];

export const therapistIdValidation = [
  param("therapistId").isMongoId().withMessage("Invalid therapist ID"),
];

export const serviceIdValidation = [
  param("serviceId").isMongoId().withMessage("Invalid service ID"),
];
