import mongoose, { Document, Schema } from "mongoose";

// Define the User interface that extends mongoose Document
interface IUser extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  companyName?: string;
  companyAddress?: string;
  apartmentUnit?: string;
  licenseNumber?: string;
  bio?: string;
  role: 'renter' | 'agent' | 'landlord';
  createdAt: Date;
  updatedAt: Date;
}

// Define the User Schema
const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // Business Information
    companyName: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'agent' || this.role === 'landlord';
      },
    },
    companyAddress: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'agent' || this.role === 'landlord';
      },
    },
    apartmentUnit: {
      type: String,
      required: false,
    },
    licenseNumber: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'agent' || this.role === 'landlord';
      },
    },
    bio: {
      type: String,
      required: false,
    },

    // User Type
    role: {
      type: String,
      enum: {
        values: ['renter', 'agent', 'landlord'],
        message: '{VALUE} is not a valid user type',
      },
      required: [true, "User type is required"],
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update the updatedAt timestamp on save
UserSchema.pre<IUser>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Create the User model with the schema
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
