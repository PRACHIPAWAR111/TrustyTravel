const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js"); // Import the User model

const MONGO_URL = "mongodb://127.0.0.1:27017/travel";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB(); // Initialize data only after successful connection
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  try {
    await Listing.deleteMany({}); // Clear existing listings

    // Create fake users for owners
    const fakeOwners = [
      { username: "JohnDoe", email: "johndoe@example.com" },
      { username: "JaneSmith", email: "janesmith@example.com" },
      { username: "AliceBrown", email: "alicebrown@example.com" },
    ];

    // Insert fake users into the database
    const users = await User.insertMany(
      fakeOwners.map((owner) => ({
        username: owner.username,
        email: owner.email,
      }))
    );

    // Assign fake owners to listings
    const listingsWithOwner = initData.data.map((obj, index) => ({
      ...obj,
      owner: users[index % users.length]._id, // Assign owners in a round-robin fashion
    }));

    await Listing.insertMany(listingsWithOwner); // Insert listings with owners
    console.log("Data was initialized with fake owners.");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
}
