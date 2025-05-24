import mongoose, { Schema, Document, Model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {type WebAuthnCredential} from "@simplewebauthn/server"
type ProviderName = "google" | "github" | "spotify" | "microsoft" | "facebook" | null;
import dotenv from "dotenv";
dotenv.config();
interface IOAuthProvider {
  providerName: ProviderName;
  sub: string | null;
}

interface IOAuth {
  providers: IOAuthProvider[];
}

export interface IUser extends Document {
  username: string;
  email: string;
  avatar?: string;
  oauth: IOAuth;
  password: string;
  refreshToken?: string;
  verificationToken?: string | null;
  isVerified: boolean;
  verificationTokenExpiryDate?: Date | null;
  TwoFAchallenge: string | null;
  TwoFAEnabled: boolean;
  TwoFAverified: boolean;
  PassKey: WebAuthnCredential | null;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    oauth: {
      providers: [
        {
          providerName: {
            type: String,
            unique: true,
            default: null,
            enum: ["google", "github", "spotify", "microsoft", "facebook"],
          },
          sub: {
            type: String,
            default: null,
          },
        },
      ],
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationTokenExpiryDate: {
      type: Date,
      default: null,
    },
    TwoFAchallenge: {
      type: String,
      default: null,
    },
    TwoFAEnabled: {
      type: Boolean,
      default: false,
    },
    TwoFAverified: {
      type: Boolean,
      default: false,
    },
    PassKey: {
      type: Schema.Types.Mixed,
      default: null,
      // Use a function to set required dynamically; note the explicit type for 'this'
      required: function (this: IUser) {
        return this.TwoFAEnabled && this.TwoFAverified;
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next:(err?: any) => void) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
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
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string||"15m",
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
}
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

