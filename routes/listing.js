const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for local file uploads
const upload = multer({
  dest: path.join(__dirname, "../uploads"), // Save files to the "uploads" directory
});

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index and Create routes
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Fetch all listings
  .post(
    isLoggedIn, // Ensure the user is logged in
    upload.single("listing[image]"), // Handle image upload locally
    validateListing, // Validate the listing data
    wrapAsync(async (req, res, next) => {
      if (req.file) {
        // Save the file path to the listing object
        req.body.listing.image = `/uploads/${req.file.filename}`;
      }
      next();
    }),
    wrapAsync(listingController.createListing) // Create a new listing
  );

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, and Delete routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show a specific listing
  .put(
    isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    validateListing,
    wrapAsync(listingController.updateListing) // Update a specific listing
  )
  .delete(
    isLoggedIn,
    isOwner, // Ensure the user is the owner of the listing
    wrapAsync(listingController.deleteListing) // Delete a specific listing
  );

// Edit route
router.get("/:id/edit",
   isLoggedIn, isOwner, 
   wrapAsync(listingController.editListing)
  );

module.exports = router;
