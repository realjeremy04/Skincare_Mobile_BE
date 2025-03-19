import { body, param } from "express-validator";
import { PaymentMethodEnum } from "$root/enums/PaymentMethodEnum";

// Validation rules cho Transaction
const validStatuses = ["pending", "completed", "failed"];
export const validateTransaction = [
  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isMongoId()
    .withMessage("Invalid Customer ID"),

  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Invalid Appointment ID"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(Object.values(PaymentMethodEnum))
    .withMessage("Invalid payment method"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string"),
];
export const validateUpdateTransaction = [
    param("transactionId")
      .notEmpty()
      .withMessage("Transaction ID is required")
      .isMongoId()
      .withMessage("Invalid Transaction ID"),
  
    body("customerId")
      .optional()
      .isMongoId()
      .withMessage("Invalid Customer ID"),
  
    body("appointmentId")
      .optional()
      .isMongoId()
      .withMessage("Invalid Appointment ID"),
  
    body("paymentMethod")
      .optional()
      .isIn(Object.values(PaymentMethodEnum))
      .withMessage("Invalid payment method"),
  
   

      

      body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isString()
      .withMessage("Status must be a string")
      .isIn(validStatuses)
      .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),
  ];
  
  // Validation khi delete transaction
  export const validateDeleteTransaction = [
    param("transactionId")
      .notEmpty()
      .withMessage("Transaction ID is required")
      .isMongoId()
      .withMessage("Invalid Transaction ID"),
  ];