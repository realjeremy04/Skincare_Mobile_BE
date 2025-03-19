import { NextFunction, Request, Response } from "express";
import Shifts from "$models/Shifts.model";
import Therapist from "$models/Therapist.model";
import AppError from "$root/utils/AppError.util";

/**
 * @swagger
 * components:
 *   schemas:
 *     Shifts:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the shift
 *           readOnly: true
 *         slotsId:
 *           type: string
 *           description: The slot ID associated with the shift
 *         appointmentId:
 *           type: string
 *           description: The appointment ID linked to the shift
 *         therapistId:
 *           type: string
 *           description: The therapist ID assigned to the shift
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the shift
 *         isAvailable:
 *           type: boolean
 *           default: true
 *           description: Whether the shift is available
 *       required:
 *         - slotsId
 *         - appointmentId
 *         - therapistId
 *         - date
 */

//Get all shifts
/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Retrieve a list of all shifts
 *     tags:
 *       - Shifts
 *     responses:
 *       200:
 *         description: A list of shift
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: No shift found
 *       500:
 *         description: Server error
 */
const getAllShifts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const shifts = await Shifts.find()
    //   .populate("slotsId")
    //   .populate("appointmentId")
    //   .populate("therapistId");
    const shifts = await Shifts.find();

    if (!shifts || shifts.length === 0) {
      return next(new AppError("No shifts found", 404));
    }
    res.status(200).json(shifts);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Get a single shift by ID
/**
 * @swagger
 * /api/shifts/{id}:
 *   get:
 *     summary: Retrieve a single shift by ID
 *     tags:
 *       - Shifts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The shift ID
 *     responses:
 *       200:
 *         description: A single shift
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Server error
 */
const getShift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shift = await Shifts.findById(req.params.shiftId)
      .populate("slotsId")
      .populate("appointmentId")
      .populate("therapistId");
    if (!shift) {
      return next(new AppError("Shift not found", 404));
    }
    res.status(200).json(shift);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Create a new shift
/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Create a new shift
 *     tags:
 *       - Shifts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shifts'
 *     responses:
 *       201:
 *         description: The created shift
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Shifts'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createShift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slotsId, appointmentId, therapistId, date, isAvailable } = req.body;
    if (!slotsId || !appointmentId || !therapistId || !date) {
      return next(new AppError("Bad request: Missing required fields", 400));
    }
    const shift = new Shifts({
      slotsId,
      appointmentId,
      therapistId,
      date,
      isAvailable,
    });
    const newShift = await shift.save();
    res.status(201).json({ message: "Shift created successfully", newShift });
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Update an existing shift by ID
/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Update an shift by ID
 *     description: This endpoint allows the updating of an shift based on its ID. Returns the updated shift if successful.
 *     tags:
 *       - Shifts
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the shift to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shifts'
 *     responses:
 *       200:
 *         description: Shift after updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: Shift not found
 *       500:
 *         description: Server error
 */
const updateShift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedShift = await Shifts.findByIdAndUpdate(
      req.params.shiftId,
      req.body,
      { new: true }
    );
    if (!updatedShift) {
      return next(new AppError("Shift not found", 404));
    }
    res
      .status(200)
      .json({ message: "Shift updated successfully", updatedShift });
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Delete an existing shift by ID
/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Delete an shift by ID
 *     description: This endpoint allows the deletion of an shift based on its ID. Returns the deleted shift if successful.
 *     tags:
 *       - Shifts
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the shift to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shift deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request, invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Shift not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const deleteShift = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedShift = await Shifts.findByIdAndDelete(req.params.shiftId);
    if (!deletedShift) {
      return next(new AppError("Shift not found", 404));
    }
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

// Get shifts by therapistId
/**
 * @swagger
 * /api/shifts/therapist/{therapistId}:
 *   get:
 *     summary: Retrieve shifts by therapistId
 *     tags:
 *       - Shifts
 *     parameters:
 *       - in: path
 *         name: therapistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The therapist ID to filter shifts
 *     responses:
 *       200:
 *         description: A list of shifts for the specified therapist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: No shifts found for this therapist
 *       500:
 *         description: Server error
 */
const getShiftsByTherapistId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { therapistId } = req.params;
    const shifts = await Shifts.find({ therapistId });

    res.status(200).json(shifts);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/shifts/therapist/upcoming/{therapistId}:
 *   get:
 *     summary: Retrieve shifts for today by therapistId
 *     tags:
 *       - Shifts
 *     parameters:
 *       - in: path
 *         name: therapistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The therapist ID to filter today's shifts
 *     responses:
 *       200:
 *         description: A list of today's shifts for the specified therapist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: No shifts found for this therapist today
 *       500:
 *         description: Server error
 */
const getUpcomingShiftsByTherapistId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { therapistId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to fetch shifts from today onward

    const shifts = await Shifts.find({
      therapistId,
      date: { $gte: today },
    })
      .populate("slotsId")
      .populate({
        path: "therapistId",
        populate: {
          path: "specialization",
        },
      });

    res.status(200).json(shifts);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/shifts/account/upcoming/{accountId}:
 *   get:
 *     summary: Retrieve shifts for today by accountId
 *     tags:
 *       - Shifts
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID to filter today's shifts
 *     responses:
 *       200:
 *         description: A list of today's shifts for the specified therapist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Shifts'
 *       404:
 *         description: No shifts found for this therapist today
 *       500:
 *         description: Server error
 */
const getUpcomingShiftsByAccountId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tìm therapist theo accountId
    const therapist = await Therapist.findOne({ accountId });
    if (!therapist) {
      return next(new AppError("Therapist not found", 404));
    }

    // Lấy therapistId từ therapist tìm được
    const { _id: therapistId } = therapist;

    // Tìm ca làm việc của therapist
    const shifts = await Shifts.find({
      therapistId,
      date: { $gte: today },
    })
      .populate("slotsId")
      .populate({
        path: "therapistId",
        populate: {
          path: "specialization",
        },
      });

    res.status(200).json(shifts);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

const ShiftsAPI = {
  getAllShifts,
  getShift,
  createShift,
  updateShift,
  deleteShift,
  getShiftsByTherapistId,
  getUpcomingShiftsByTherapistId,
  getUpcomingShiftsByAccountId,
};

export default ShiftsAPI;
