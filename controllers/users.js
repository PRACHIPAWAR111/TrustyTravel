const User= require("../models/user");

module.exports.rendersignupForm=async (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLoginform=(req, res) => {
    res.render("users/login"); // Fix the typo in the file extension (removed the extra ".")
  };


module.exports.signup=async(req, res) => {
    try{
    let {username, email,password} =req.body;
   const newUser= new User({email, username});
    const registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to TrustyTravals!");
    res.redirect("/listings");
    });
 } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.login=async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings/new"; // Redirect to "/listings/new" after login
    res.redirect(redirectUrl);
  };

  module.exports.logout=(req,res) =>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });

    };