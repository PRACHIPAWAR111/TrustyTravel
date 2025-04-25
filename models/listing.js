const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "/uploads/default.jpg", // Default image path
    set: (v) => (v === "" ? "/uploads/default.jpg" : v), // Ensure default image is used if empty
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference the Review model
    },
  ],

  owner:{
    type:Schema.Types.ObjectId,
    ref: "User",
  },

 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;