import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAcademicDetails {
  school?: string;
  grade?: string;
  stream?: string; // e.g., Science, Commerce
}

export interface IUserSettings {
  pomodoroFocus: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  aiSummaryLength: "short" | "medium" | "long";
  theme: "light" | "dark" | "system";
  notifications: boolean;
}

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string; // For credentials provider
  image?: string;
  role: "student" | "admin" | "teacher";
  phone?: string;
  language?: string;
  isAnonymous: boolean;
  academicDetails?: IAcademicDetails;
  settings: IUserSettings;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false }, // Hide by default
    image: { type: String },
    role: {
      type: String,
      enum: ["student", "admin", "teacher"],
      default: "student",
    },
    phone: { type: String },
    language: { type: String, default: "en" },
    isAnonymous: { type: Boolean, default: false },
    academicDetails: {
      school: String,
      grade: String,
      stream: String,
    },
    settings: {
      pomodoroFocus: { type: Number, default: 25 },
      pomodoroShortBreak: { type: Number, default: 5 },
      pomodoroLongBreak: { type: Number, default: 15 },
      aiSummaryLength: { type: String, enum: ["short", "medium", "long"], default: "medium" },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

// Prevent overwrite in hot-reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
