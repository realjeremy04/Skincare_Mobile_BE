import { body, param } from "express-validator";

// Validation khi tạo UserQuiz
export const validateCreateUserQuiz = [
  body("accountId")
    .notEmpty()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Invalid Account ID"),

  body("scoreBandId")
    .notEmpty()
    .withMessage("Score Band ID is required")
    .isMongoId()
    .withMessage("Invalid Score Band ID"),

  body("result")
    .isArray({ min: 1 })
    .withMessage("Result must be an array with at least one item"),

  body("result.*.title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),

  body("result.*.answer")
    .notEmpty()
    .withMessage("Answer is required")
    .isIn(["Never", "Sometimes", "Often"])
    .withMessage("Answer must be one of: Never, Sometimes, Often"),

  body("result.*.point")
    .notEmpty()
    .withMessage("Point is required")
    .isNumeric()
    .withMessage("Point must be a number"),

  body("totalPoint")
    .notEmpty()
    .withMessage("Total Point is required")
    .isNumeric()
    .withMessage("Total Point must be a number"),

  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("createdAt must be a valid date"),

  body("updatedAt")
    .optional()
    .isISO8601()
    .withMessage("updatedAt must be a valid date"),
];

// Validation khi cập nhật UserQuiz
export const validateUpdateUserQuiz = [
  param("userQuizId")
    .notEmpty()
    .withMessage("User Quiz ID is required")
    .isMongoId()
    .withMessage("Invalid User Quiz ID"),

  body("result")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Result must be an array with at least one item"),

  body("result.*.title")
    .optional()
    .isString()
    .withMessage("Title must be a string"),

  body("result.*.answer")
    .optional()
    .isIn(["Never", "Sometimes", "Often"])
    .withMessage("Answer must be one of: Never, Sometimes, Often"),

  body("result.*.point")
    .optional()
    .isNumeric()
    .withMessage("Point must be a number"),

  body("totalPoint")
    .optional()
    .isNumeric()
    .withMessage("Total Point must be a number"),

  body("createdAt")
    .optional()
    .isISO8601()
    .withMessage("createdAt must be a valid date"),

  body("updatedAt")
    .optional()
    .isISO8601()
    .withMessage("updatedAt must be a valid date"),
];

// Validation khi xóa UserQuiz
export const validateDeleteUserQuiz = [
  param("userQuizId")
    .notEmpty()
    .withMessage("User Quiz ID is required")
    .isMongoId()
    .withMessage("Invalid User Quiz ID"),
];
