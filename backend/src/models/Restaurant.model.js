import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      street: {
        type: String,
        required: [true, "Street is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      pincode: {
        type: String,
        required: [true, "Pincode is required"],
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    deliveryTime: {
      type: Number,
      default: 30, // in minutes
    },
    minOrder: {
      type: Number,
      default: 100,
      min: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for ownerId backward compatibility
restaurantSchema.virtual("ownerId").get(function () {
  return this.owner;
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;