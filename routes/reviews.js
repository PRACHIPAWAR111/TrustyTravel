const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge params to access `:id`
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/reviews.js"); // Fix capitalization of the import
const ExpressError = require("../utils/ExpressError.js");

// Validation middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create review
router.post(
  "/",
  isLoggedIn, // Ensure the user is logged in
  validateReview,
  wrapAsync(reviewController.createReview) // Use the controller function
);

// Delete review
router.delete(
  "/:reviewId",
  isLoggedIn, // Ensure the user is logged in
  isReviewAuthor, // Ensure the user is the author of the review
  wrapAsync(reviewController.deleteReview) // Use the controller function
);

module.exports = router;
