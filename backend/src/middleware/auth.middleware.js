import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Verify specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    const normalizedUserRole = req.user.role?.toLowerCase();
    const normalizedAllowedRoles = roles.map((r) => r.toLowerCase());

    // Map common aliases
    const isOwner =
      normalizedUserRole === "restaurantowner" ||
      normalizedUserRole === "owner";

    const allowed =
      normalizedAllowedRoles.includes(normalizedUserRole) ||
      (normalizedAllowedRoles.includes("owner") && isOwner) ||
      (normalizedAllowedRoles.includes("restaurantowner") && isOwner);

    if (!allowed) {
      return next(
        new ApiError(
          403,
          `Access denied. Role (${req.user.role}) is not authorized to access this resource`
        )
      );
    }
    next();
  };
};

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Unauthorized Request (Admin only)");
  }
  next();
});

export const verifyOwner = asyncHandler(async (req, res, next) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== "restaurantowner" && role !== "owner" && role !== "admin") {
    throw new ApiError(403, "Unauthorized Request (Restaurant Owner or Admin only)");
  }
  next();
});

export const verifyOwnerOrAdmin = verifyOwner;
