import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
        enum: ["customer", "restaurantOwner", "admin"],
        default: "customer",
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();

    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.passwordHash);
};

const genrateAccesstoken = async()=>{
 return jwt.sign({ 
    userId: this._id,
    email :this.email,
    name :this.name 
    },
    process.env.JWT_ACCESS_SECRATE, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });
}

const genrateRefreshtoken = async()=>{
    return jwt.sign({ 
        userId: this._id,  
    },
    process.env.JWT_REFRESH_SECRATE,
    {
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
      });
}   

const User = mongoose.model("User", userSchema);

export default User;