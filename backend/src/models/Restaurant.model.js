const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        cuisine: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        imageUrl: {
            type: String,
            default: "",
        },

        rating: {
            type: Number,
            default: 0,
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
            required: true,
        },

        minOrder: {
            type: Number,
            required: true,
            min: 0,
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);