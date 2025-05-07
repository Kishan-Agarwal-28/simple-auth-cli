import { Request, Response, NextFunction } from "express";
import { apiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// Extend Express Request interface to include a "user" property.
interface CustomRequest extends Request {
  user?: any;
}

export const verifyJWT = asyncHandler(
  async (req: CustomRequest, _: Response, next: NextFunction) => {
    try {
      // Retrieve token from cookies or the Authorization header.
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new apiError(401, "Unauthorized request");
      }

      // Cast the secret to string and decode the token.
      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { _id: string };

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new apiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      throw new apiError(401, error?.message || "Invalid access token");
    }
  }
);
