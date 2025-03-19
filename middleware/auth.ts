import { RoleEnum } from "$root/enums/RoleEnum";
import Account from "$root/models/Account.model";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// Define JWT_SECRET (should ideally come from environment variables)
const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";

// Define the shape of the decoded JWT payload
interface JwtPayload {
  _id: string;
  role: RoleEnum;
}

// Extend Express Request type to include user property
interface AuthRequest extends Request {
  user?: JwtPayload;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; 
    next();
  } catch (error) {
    console.error(
      "JWT verification error:",
      error instanceof Error ? error.stack : error
    );
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    res.status(500).json({ error: "Authentication error" });
  }
};
// const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   const token = req.cookies.jwt;

//   if (!token) {
//     res.status(401).json({ error: "Authentication required" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
//     req.user = decoded; // Attach decoded payload to req.user
//     next();
//   } catch (error) {
//     console.error(
//       "JWT verification error:",
//       error instanceof Error ? error.stack : error
//     );
//     if (error instanceof jwt.TokenExpiredError) {
//       res.status(401).json({ error: "Token expired" });
//       return;
//     }
//     if (error instanceof jwt.JsonWebTokenError) {
//       res.status(401).json({ error: "Invalid token" });
//       return;
//     }
//     // Handle unexpected errors
//     res.status(500).json({ error: "Authentication error" });
//   }
// };

const checkActive = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res
      .status(500)
      .json({ error: "Authentication middleware must run before checkActive" });
    return;
  }

  try {
    const user = await Account.findById(req.user._id).select("isActive");
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    if (!user.isActive) {
      res.status(403).json({ error: "Account is inactive" });
      return;
    }
    next();
  } catch (error) {
    console.error(
      "Error in checkActive:",
      error instanceof Error ? error.stack : error
    );
    res.status(500).json({ error: "Server error during account check" });
  }
};

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res
      .status(500)
      .json({ error: "Authentication middleware must run before isAdmin" });
    return;
  }

  if (req.user.role !== RoleEnum.Admin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};

const isTherapistOrStaff = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res
      .status(500)
      .json({ error: "Authentication middleware must run before isAdmin" });
    return;
  }

  if (
    req.user.role !== RoleEnum.Therapist &&
    req.user.role !== RoleEnum.Staff
  ) {
    res.status(403).json({ error: "Therapist or Staff access required" });
    return;
  }

  next();
};

const isTherapist = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res
      .status(500)
      .json({ error: "Authentication middleware must run before isAdmin" });
    return;
  }

  if (req.user.role !== RoleEnum.Therapist) {
    res.status(403).json({ error: "Therapist access required" });
    return;
  }

  next();
};

const isStaff = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res
      .status(500)
      .json({ error: "Authentication middleware must run before isStaff" });
    return;
  }

  if (req.user.role !== RoleEnum.Staff) {
    res.status(403).json({ error: "Staff access required" });
    return;
  }

  next();
};

const isStaffOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(500).json({
      error: "Authentication middleware must run before isStaffOrAdmin",
    });
    return;
  }

  if (req.user.role !== RoleEnum.Staff && req.user.role !== RoleEnum.Admin) {
    res.status(403).json({ error: "Staff or Admin access required" });
    return;
  }

  next();
};

// Export as ES6 module
export {
  auth,
  checkActive,
  isAdmin,
  isStaff,
  isStaffOrAdmin,
  isTherapistOrStaff,
  isTherapist,
};
