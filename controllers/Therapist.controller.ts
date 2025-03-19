import { NextFunction, Request, Response } from "express";
import Therapist from "$models/Therapist.model";
import AppError from "$root/utils/AppError.util";

/**
 * @swagger
 * components:
 *   schemas:
 *     Therapist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the therapist
 *           readOnly: true
 *         accountId:
 *           type: string
 *           description: The associated account ID
 *         specialization:
 *           type: array
 *           items:
 *             type: string
 *           description: List of service IDs the therapist specializes in
 *         certification:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               issuedBy:
 *                 type: string
 *               issuedDate:
 *                 type: string
 *                 format: date
 *           description: List of certifications
 *         experience:
 *           type: string
 *           description: Years of experience
 *       required:
 *         - accountId
 *         - specialization
 *         - certification
 *         - experience
 */

// Get all therapists
/**
 * @swagger
 * /api/therapist:
 *   get:
 *     summary: Retrieve a list of all therapists
 *     tags:
 *       - Therapist
 *     responses:
 *       200:
 *         description: A list of therapists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: No therapists found
 *       500:
 *         description: Server error
 */
const getAllTherapists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const therapists = await Therapist.find().populate("specialization");
    if (!therapists.length) {
      return next(new AppError("No therapists found", 404));
    }
    res.status(200).json(therapists);
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
};

// Get a single therapist
/**
 * @swagger
 * /api/therapist/{id}:
 *   get:
 *     summary: Retrieve a therapist by ID
 *     tags:
 *       - Therapist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The therapist ID
 *     responses:
 *       200:
 *         description: A single therapist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Therapist'
 *       404:
 *         description: Therapist not found
 *       500:
 *         description: Server error
 */
const getTherapist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const therapist = await Therapist.findById(req.params.therapistId).populate(
      "specialization"
    );
    if (!therapist) {
      return next(new AppError("Therapist not found", 404));
    }
    res.status(200).json(therapist);
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
};

// Create a new therapist
/**
 * @swagger
 * /api/therapist:
 *   post:
 *     summary: Create a new therapist
 *     tags:
 *       - Therapist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Therapist'
 *     responses:
 *       201:
 *         description: The created therapist
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createTherapist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const therapist = new Therapist(req.body);
    const newTherapist = await therapist.save();
    res.status(201).json({ message: "Created Successfully", newTherapist });
  } catch (error) {
    next(new AppError("Failed to create therapist", 500));
  }
};

// Delete a therapist
/**
 * @swagger
 * /api/therapist/{id}:
 *   delete:
 *     summary: Delete a therapist by ID
 *     tags:
 *       - Therapist
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Therapist deleted successfully
 *       404:
 *         description: Therapist not found
 *       500:
 *         description: Server error
 */
const deleteTherapist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.therapistId);
    if (!therapist) {
      return next(new AppError("Therapist not found", 404));
    }
    res.status(200).json({ message: "Deleted Successfully", therapist });
  } catch (error) {
    next(new AppError("Failed to delete therapist", 500));
  }
};

// Update a therapist
/**
 * @swagger
 * /api/therapist/{id}:
 *   put:
 *     summary: Update a therapist by ID
 *     tags:
 *       - Therapist
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
 *             $ref: '#/components/schemas/Therapist'
 *     responses:
 *       200:
 *         description: Therapist updated successfully
 *       404:
 *         description: Therapist not found
 *       500:
 *         description: Server error
 */
const updateTherapist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Không cho phép cập nhật accountId
    if ("accountId" in req.body) {
      return next(new AppError("Cannot update accountId", 400));
    }

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.therapistId,
      req.body,
      { new: true }
    );
    if (!therapist) {
      return next(new AppError("Therapist not found", 404));
    }
    res.status(200).json({ message: "Updated Successfully", therapist });
  } catch (error) {
    next(new AppError("Failed to update therapist", 500));
  }
};

//Get all therapist by serviceId
/**
 * @swagger
 * /api/therapist/by-service/{serviceId}:
 *   get:
 *     summary: Retrieve therapists by service ID in their specialization
 *     tags:
 *       - Therapist
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID to filter therapists by
 *     responses:
 *       200:
 *         description: A list of therapists with the specified service in their specialization
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Therapist'
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: No therapists found for this service
 *       500:
 *         description: Server error
 */
const getTherapistsByServiceId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { serviceId } = req.params;

    // Kiểm tra nếu serviceId không được cung cấp hoặc không hợp lệ
    if (!serviceId || typeof serviceId !== "string") {
      return next(new AppError("Invalid service ID", 400));
    }

    // Tìm các therapist có specialization chứa serviceId
    const therapists = await Therapist.find({
      specialization: { $in: [serviceId] },
    })
      .populate("accountId")
      .populate("specialization");

    if (!therapists.length) {
      return next(new AppError("No therapists found for this service", 404));
    }

    res.status(200).json(therapists);
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
};

const TherapistAPI = {
  getAllTherapists,
  getTherapist,
  createTherapist,
  deleteTherapist,
  updateTherapist,
  getTherapistsByServiceId,
};
export default TherapistAPI;
