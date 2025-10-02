import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1]; // "Bearer token"

    if (!token) {
       res.status(401).json({ message: "No token provided" });
       return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
