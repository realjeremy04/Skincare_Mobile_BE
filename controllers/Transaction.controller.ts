import { NextFunction, Request, Response } from "express";
import Transaction from "$models/Transaction.model";
import Appointment from "$models/Appointment.model";
import Shifts from "$models/Shifts.model";
import Service from "$models/Service.model";
import AppError from "$root/utils/AppError.util";
import { validationResult } from "express-validator";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the transaction
 *           readOnly: true
 *         customerId:
 *           type: string
 *           description: The ID of the customer making the transaction
 *         appointmentId:
 *           type: string
 *           description: The ID of the appointment related to the transaction
 *         paymentMethod:
 *           type: string
 *           description: The method of payment
 *         status:
 *           type: string
 *           description: The status of the transaction
 *       required:
 *         - customerId
 *         - appointmentId
 *         - paymentMethod
 *         - status
 */

// Get all transactions
/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: Retrieve a list of all transactions
 *     tags:
 *       - Transaction
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: No transactions found
 *       500:
 *         description: Server error
 */
const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transactions = await Transaction.find();
    if (!transactions || transactions.length === 0) {
      return next(new AppError("No transactions found", 404));
    }
    res.status(200).json(transactions);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

// Get a single transaction
/**
 * @swagger
 * /api/transaction/{id}:
 *   get:
 *     summary: Retrieve a single transaction by ID
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *     responses:
 *       200:
 *         description: A single transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
const getTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return next(new AppError("Transaction not found", 404));
    }
    res.status(200).json(transaction);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

// Create a new transaction
/**
 * @swagger
 * /api/transaction:
 *   post:
 *     summary: Create a new transaction with appointment
 *     tags:
 *       - Transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               therapistId:
 *                 type: string
 *                 description: TherapistID
 *               slotsId:
 *                 type: string
 *                 description: SlotsID
 *               serviceId:
 *                 type: string
 *                 description: ServiceID
 *               notes:
 *                 type: string
 *                 description: Notes by Customer
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date in ISO 8601 format
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Cash", "VNPay"]
 *                 description: Payment method used
 *     responses:
 *       201:
 *         description: The created appointment, shift, and transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newAppointment:
 *                   $ref: '#/components/schemas/Appointment'
 *                 shift:
 *                   $ref: '#/components/schemas/Shift'
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Kiểm tra các trường bắt buộc
    if (
      !req.body.therapistId ||
      !req.body.slotsId ||
      !req.body.serviceId ||
      !req.body.paymentMethod
    ) {
      return next(new AppError("Bad request", 400));
    }
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // Kiểm tra service
    const service = await Service.findById(req.body.serviceId);
    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    // Tạo appointment
    const appointment = new Appointment({
      therapistId: req.body.therapistId,
      customerId: req.user._id,
      slotsId: req.body.slotsId,
      serviceId: req.body.serviceId,
      checkInImage: "",
      checkOutImage: "",
      notes: req.body.notes,
      amount: service.price,
      status: "Scheduled",
    });

    const newAppointment = await appointment.save();

    // Tạo shift
    const shift = new Shifts({
      slotsId: req.body.slotsId,
      appointmentId: newAppointment._id,
      therapistId: req.body.therapistId,
      date: req.body.date,
      isAvailable: true,
    });

    await shift.save();

    // Tạo transaction
    const transaction = new Transaction({
      customerId: req.user._id,
      appointmentId: newAppointment._id,
      paymentMethod: req.body.paymentMethod,
      status: "pending",
    });

    const newTransaction = await transaction.save();

    res.status(201).json({
      newAppointment,
      shift,
      transaction: newTransaction,
    });
  } catch (err: Error | any) {
    console.log(err);
    return next(new AppError("Internal Server Error", 500));
  }
};

// Update an existing transaction
/**
 * @swagger
 * /api/transaction/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      req.body,
      { new: true }
    );

    if (!updatedTransaction) {
      return next(new AppError("Transaction not found", 404));
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    next(new AppError("Failed to update transaction", 500));
  }
};

// Delete an existing transaction
/**
 * @swagger
 * /api/transaction/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags:
 *       - Transaction
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.transactionId
    );

    if (!deletedTransaction) {
      return next(new AppError("Transaction not found", 404));
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(new AppError("Failed to delete transaction", 500));
  }
};

/**
 * @swagger
 * /api/transaction/customer/{customerId}:
 *   get:
 *     summary: Retrieve all transactions for a specific customer
 *     tags:
 *       - Transaction
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: List of transactions for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: No transactions found for this customer
 *       500:
 *         description: Server error
 */
const getTransactionsByCustomerId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transactions = await Transaction.find({
      customerId: req.params.customerId,
    })
      .populate("customerId", "email")
      .populate("appointmentId", "_id");

    if (!transactions || transactions.length === 0) {
      return next(new AppError("No transactions found for this customer", 404));
    }

    res.status(200).json({
      status: "success",
      results: transactions.length,
      data: transactions,
    });
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

const TransactionAPI = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByCustomerId,
};

export default TransactionAPI;
