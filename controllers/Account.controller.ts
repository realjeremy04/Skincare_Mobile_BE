import { NextFunction, Request, Response } from "express";
import Account from "$models/Account.model";
import AppError from "$root/utils/AppError.util";
import { RoleEnum } from "$root/enums/RoleEnum";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface AuthenticatedRequest extends Request {
  user?: { _id: string; role: string };
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the account (auto-generated by MongoDB)
 *           readOnly: true
 *         username:
 *           type: string
 *           description: The username of the account
 *         password:
 *           type: string
 *           description: The password of the account (hashed in database)
 *           writeOnly: true
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the account
 *         role:
 *           type: string
 *           enum: [Admin, Customer]
 *           description: The role of the user
 *         dob:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: The date of birth of the account holder (YYYY-MM-DD)
 *         isActive:
 *           type: boolean
 *           description: Account activation status
 *       required:
 *         - username
 *         - password
 *         - email
 *         - role
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 */

/**
 * @swagger
 * /api/account:
 *   get:
 *     summary: Retrieve a list of all accounts
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No accounts found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAllAccounts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }
  if (req.user.role !== RoleEnum.Admin) {
    return next(new AppError("Unauthorized: Admin access required", 403));
  }
  try {
    const users = await Account.find();
    if (!users || users.length === 0) {
      return next(new AppError("No accounts found", 404));
    }
    res.status(200).json(users);
  } catch (err: AppError | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account/profile:
 *   get:
 *     summary: Retrieve a single account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/account/profileJWT:
 *   get:
 *     summary: Retrieve a single account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const getAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }
  try {
    const user = await Account.findById(req.user?._id).select("-password");
    if (!user) {
      return next(new AppError("Account not found", 404));
    } else if (!user.isActive) {
      return next(new AppError("Account is deactivated", 404));
    }

    res.status(200).json({
      message: "Account retrieved successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Get account error:",
      error instanceof Error ? error.stack : error
    );
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer]
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                type: string
 *             required:
 *               - username
 *               - password
 *               - email
 *               - dob
 *     responses:
 *       200:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.email ||
      !req.body.dob ||
      !req.body.role ||
      !req.body.phone
    ) {
      return next(new AppError("Bad request", 400));
    }

    const { username, email, password, dob, phone, role } = req.body;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const errors: { msg: string }[] = [];

    if (!username || !email || !password || !dob || !phone || !role) {
      errors.push({
        msg: "Please enter all required fields (username, email, password, date of birth, phone number)",
      });
    }
    if (password && password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      errors.push({ msg: "Invalid date of birth format. Use YYYY-MM-DD." });
      res.status(400).json({ errors });
      return;
    }

    const dobYear = dobDate.getFullYear();
    if (dobYear > currentYear) {
      errors.push({ msg: "Date of Birth cannot be in the future" });
      res.status(400).json({ errors });
      return;
    }
    if (dobYear < currentYear - 120) {
      errors.push({
        msg: "Date of Birth cannot be more than 120 years in the past",
      });
      res.status(400).json({ errors });
      return;
    }

    if (phone && phone.length < 10) {
      errors.push({ msg: "Phone number must be at least 10 digits" });
    }

    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      errors.push({ msg: "Email already exists" });
      res.status(400).json({ errors });
      return;
    }

    const existingUsername = await Account.findOne({ username });
    if (existingUsername) {
      errors.push({ msg: "Username already exists" });
      res.status(400).json({ errors });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const user = new Account(req.body);

    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err: Error | any) {
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account/{id}:
 *   delete:
 *     summary: Delete an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 _id:
 *                   type: string
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }
  if (req.user.role !== RoleEnum.Admin) {
    return next(new AppError("Unauthorized: Admin access required", 403));
  }

  try {
    const user = await Account.findByIdAndDelete(req.params?.id);
    if (!user) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete account error:",
      error instanceof Error ? error.stack : error
    );
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account/updateProfile:
 *   put:
 *     summary: Update an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer]
 *               dob:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/account/updateProfileJWT/{id}:
 *   put:
 *     summary: Update an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the account to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer]
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
interface UpdateAccountBody {
  username?: string;
  email?: string;
  role?: string;
  dob?: string;
  phone?: string;
  id: string;
}

const updateAccount = async (
  req: AuthenticatedRequest & { body: UpdateAccountBody },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return next(new AppError("No update data provided", 400));
    }

    const user = await Account.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account updated successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Update account error:",
      error instanceof Error ? error.stack : error
    );
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account/{id}:
 *   put:
 *     summary: Update an account (Admin)
 *     description: Updates account details for a specific user by ID (Admin access required)
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [Admin, Customer]
 *               dob:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: No update data provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const updateAccountAdmin = async (
  req: AuthenticatedRequest & { body: UpdateAccountBody },
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return next(new AppError("No update data provided", 400));
    }

    const user = await Account.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account updated successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Update account error:",
      error instanceof Error ? error.stack : error
    );
    return next(new AppError("Internal Server Error", 500));
  }
};

/**
 * @swagger
 * /api/account/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               phone:
 *                type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - dob
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, dob, phone } = req.body;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const errors: { msg: string }[] = [];

  if (!username || !email || !password || !dob || !phone) {
    errors.push({
      msg: "Please enter all required fields (username, email, password, date of birth, phone number)",
    });
  }
  if (password && password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) {
    errors.push({ msg: "Invalid date of birth format. Use YYYY-MM-DD." });
    res.status(400).json({ errors });
    return;
  }

  const dobYear = dobDate.getFullYear();
  if (dobYear > currentYear) {
    errors.push({ msg: "Date of Birth cannot be in the future" });
    res.status(400).json({ errors });
    return;
  }
  if (dobYear < currentYear - 120) {
    errors.push({
      msg: "Date of Birth cannot be more than 120 years in the past",
    });
    res.status(400).json({ errors });
    return;
  }

  if (phone && phone.length < 10) {
    errors.push({ msg: "Phone number must be at least 10 digits" });
  }

  try {
    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      errors.push({ msg: "Email already exists" });
      res.status(400).json({ errors });
      return;
    }

    const existingUsername = await Account.findOne({ username });
    if (existingUsername) {
      errors.push({ msg: "Username already exists" });
      res.status(400).json({ errors });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Account({
      username,
      email,
      password: hashedPassword,
      role: RoleEnum.Customer,
      phone,
      dob: dobDate,
      isActive: true,
    });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    res.status(201).json({
      message: "Registration successful, please log in",
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error instanceof Error ? error.stack : error
    );
    res
      .status(500)
      .json({ errors: [{ msg: "Server error occurred. Please try again." }] });
  }
};

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/Account'
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const errors: { msg: string }[] = [];

  if (!email || !password) {
    errors.push({ msg: "Email and password are required" });
    res.status(400).json({ errors });
    return;
  }

  try {
    const user = await Account.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      errors.push({ msg: "Invalid credentials" });
      res.status(401).json({ errors });
      return;
    }
    if (!user.isActive) {
      errors.push({ msg: "Account is deactivated" });
      res.status(403).json({ errors });
      return;
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: 86400,
    });

    // Remove res.cookie and return the token in the response
    console.log("User logged in:", user.email);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        dob: user.dob,
        role: user.role,
        isActive: user.isActive,
      },
      token, // Return the token directly
    });
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.stack : error);
    res
      .status(500)
      .json({ errors: [{ msg: "Server error occurred. Please try again." }] });
  }
};

//Login account with token on Cookies
/**
 * @swagger
 * /api/account/loginWithCookies:
 *   post:
 *     summary: User login with email and password
 *     description: Authenticates a user and sets a JWT cookie
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     dob:
 *                       type: string
 *                       format: date
 *                     role:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     token:
 *                       type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               description: JWT token set in cookie
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       403:
 *         description: Forbidden - Account deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

const loginWithCookies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as { email?: string; password?: string };
  const errors: { msg: string }[] = [];

  if (!email || !password) {
    errors.push({ msg: "Email and password are required" });
    res.status(400).json({ errors });
    return;
  }

  try {
    const user = await Account.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      errors.push({ msg: "Invalid credentials" });
      res.status(401).json({ errors });
      return;
    }
    if (!user.isActive) {
      errors.push({ msg: "Account is deactivated" });
      res.status(403).json({ errors });
      return;
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("User logged in:", user.email);
    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        dob: user.dob,
        role: user.role,
        isActive: user.isActive,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error instanceof Error ? error.stack : error);
    res
      .status(500)
      .json({ errors: [{ msg: "Server error occurred. Please try again." }] });
  }
};

/**
 * @swagger
 * /api/account/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(
      "Logout error:",
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({
      errors: [{ msg: "Error during logout process" }],
    });
  }
};

/**
 * @swagger
 * /api/account/changePassword:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/account/changePasswordJWT:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };
  try {
    const user = await Account.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!currentPassword || !newPassword) {
      return next(
        new AppError("Current password and new password are required", 400)
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid current password", 400));
    }

    if (currentPassword === newPassword) {
      return next(
        new AppError(
          "New password must be different from current password",
          400
        )
      );
    }

    if (newPassword.length < 6) {
      return next(
        new AppError("New password must be at least 6 characters", 400)
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log("Password changed for:", user.email);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(
      "Password change error:",
      error instanceof Error ? error.stack : error
    );
    return next(new AppError("Password change failed", 500));
  }
};

const AccountAPI = {
  getAccount,
  getAllAccounts,
  createAccount,
  deleteAccount,
  updateAccount,
  updateAccountAdmin,
  login,
  loginWithCookies,
  logout,
  register,
  changePassword,
};

export default AccountAPI;
