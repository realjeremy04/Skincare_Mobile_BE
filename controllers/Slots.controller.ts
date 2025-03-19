import { NextFunction, Request, Response } from "express";
import Slots from "$models/Slots.model";
import AppError from "$root/utils/AppError.util";

/**
 * @swagger
 * components:
 *   schemas:
 *     Slots:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the slot
 *           readOnly: true
 *         slotNum:
 *           type: number
 *           description: The slot number
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The start time of the slot
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The end time of the slot
 *       required:
 *         - slotNum
 *         - startTime
 *         - endTime
 */

//Get all slots
/**
 * @swagger
 * /api/slots:
 *   get:
 *     summary: Retrieve a list of all slots
 *     tags:
 *       - Slots
 *     responses:
 *       200:
 *         description: A list of slot
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slots'
 *       404:
 *         description: No slot found
 *       500:
 *         description: Server error
 */
const getAllSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slots = await Slots.find();
    if (!slots || slots.length === 0) {
      return next(new AppError("No slots found", 404));
    }
    res.status(200).json(slots);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Get a single slot
/**
 * @swagger
 * /api/slots/{id}:
 *   get:
 *     summary: Retrieve a single slot by ID
 *     tags:
 *       - Slots
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The slot ID
 *     responses:
 *       200:
 *         description: A single slot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slots'
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Server error
 */
const getSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const slot = await Slots.findById(req.params.slotId);
    if (!slot) {
      return next(new AppError("Slot not found", 404));
    }
    res.status(200).json(slot);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Create a new slot
/**
 * @swagger
 * /api/slots:
 *   post:
 *     summary: Create a new slot
 *     tags:
 *       - Slots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slots'
 *     responses:
 *       201:
 *         description: The created slot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Slots'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slotNum, startTime, endTime } = req.body;
    if (!slotNum || !startTime || !endTime) {
      return next(new AppError("Bad request: Missing required fields", 400));
    }
    const slot = new Slots({ slotNum, startTime, endTime });
    const newSlot = await slot.save();
    res.status(201).json({ message: "Slot created successfully", newSlot });
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Update an existing slot
/**
 * @swagger
 * /api/slots/{id}:
 *   put:
 *     summary: Update an slot by ID
 *     description: This endpoint allows the updating of an slot based on its ID. Returns the updated slot if successful.
 *     tags:
 *       - Slots
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the slot to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Slots'
 *     responses:
 *       200:
 *         description: Slot after updated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Slots'
 *       404:
 *         description: Slot not found
 *       500:
 *         description: Server error
 */
const updateSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedSlot = await Slots.findByIdAndUpdate(
      req.params.slotId,
      req.body,
      { new: true }
    );
    if (!updatedSlot) {
      return next(new AppError("Slot not found", 404));
    }
    res.status(200).json({ message: "Slot updated successfully", updatedSlot });
  } catch (err) {
    return next(new AppError("Internal Server Error", 500));
  }
};

//Delete an existing slot
/**
 * @swagger
 * /api/slots/{id}:
 *   delete:
 *     summary: Delete an slot by ID
 *     description: This endpoint allows the deletion of an slot based on its ID. Returns the deleted slot if successful.
 *     tags:
 *       - Slots
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the slot to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slot deleted successfully
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
 *         description: Slot not found
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
const deleteSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedSlot = await Slots.findByIdAndDelete(req.params.slotId);
    if (!deletedSlot) {
      return next(new AppError("Slot not found", 404));
    }
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (err) {
    return next(new AppError("Internal Server Error", 500));
  }
};

const SlotsAPI = {
  getAllSlots,
  getSlot,
  createSlot,
  updateSlot,
  deleteSlot,
};

export default SlotsAPI;
