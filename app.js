if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); // Ensure the correct file name is used
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js"); // Add reviewSchema
const ReviewModel = require("./models/review.js"); // Ensure this is correct

const MONGO_URL = "mongodb://127.0.0.1:27017/travel";

const session = require("express-session")
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy =require("passport-local")
const User= require("./models/user.js");

const listings = require("./routes/listing.js");
const reviewRoutes = require("./routes/reviews.js"); // Ensure this is correct
const userRouter = require("./routes/user.js"); // Ensure this is correct

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "./public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true, // Add a comma here
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Use a Date object
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Root route
app.get("/", (req, res) => {
  res.send("Hey, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Add currentUser to res.locals
  next();
});

//app.get("/demouser", async(req, res) =>{
  //let fakeUser = new User({
    //email:" student@gmail.com"
 // });

  //let registeredUser = await User.register(fakeUser, "helloworld");
  //res.send(registeredUser);
//});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRouter); // Ensure this is correctly set up

// Catch-all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong..." } = err;
  res.status(statusCode).render("error.ejs", { message }); // Ensure error.ejs exists in views
});

// Start server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});