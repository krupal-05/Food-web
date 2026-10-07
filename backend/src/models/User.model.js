import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
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
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "restaurantOwner", "admin", "deliveryAgent"],
      default: "customer",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    avatar: {
      type: String,
      default: "",
    },
    reFreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  const secret = process.env.JWT_ACCESS_SECRET || "poiuyt123456789rewqasdfghjklmnbv_access_secret_key_12345";
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || "1d";

  return jwt.sign(
    {
      _id: this._id,
      userId: this._id,
      email: this.email,
      role: this.role,
      name: `${this.firstName} ${this.lastName}`.trim(),
    },
    secret,
    {
      expiresIn,
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const secret = process.env.JWT_REFRESH_SECRET || "poiuytrewqas123456789dfghjklmnbv_refresh_secret_key_12345";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || "7d";

  return jwt.sign(
    {
      _id: this._id,
      userId: this._id,
    },
    secret,
    {
      expiresIn,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
