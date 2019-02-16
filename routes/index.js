const express = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    User      = require("../models/user"),
    async     = require("async"),
    nodemailer= require("nodemailer"),
    crypto    = require("crypto");

router.get("/",function(req,res){
    res.render("landing");
});
// 
//===============
//Auth Routes
//===============

//Sign Up

router.get("/register",(req,res)=>{
    res.render("register");
});
//Sign Up logic
router.post("/register",(req,res)=>{
    const newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , (err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("Welcome Aboard !! "+user.username);
            res.redirect("/campgrounds");
        });
    });
});

//login
router.get("/login",(req,res)=>{
    res.render("login");
});
//Login Logic-with middleware
router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req,res)=>{
});


//logout Route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged out successfully");
    res.redirect("/");
});
//Forgot password
router.get("/forgot",(req,res)=>{
    res.render("forgot");
});



module.exports = router;