import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface IUser extends Document {
  username: string;
  email: string;
  avatar?: string;
  password: string;
  refreshToken?: string;
  verificationToken?: string | null;
  isVerified: boolean;
  verificationTokenExpiryDate?: Date | null;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next: (err?: any) => void) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET as string || "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    {
      _id: this._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY!,
    }
  );
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

