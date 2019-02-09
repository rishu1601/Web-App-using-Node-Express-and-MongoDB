const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      Campground     = require("./models/campground"),
      User           = require("./models/user"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      seedDB         = require("./seeds"),
      flash          = require("connect-flash"),
      Comment        = require("./models/comments"),
      methodOverride = require("method-override");


const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgounds"),
      indexRoutes      = require("./routes/index");

app.use(flash());
mongoose.connect("mongodb://localhost/yelp_camp_v5",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));

//seedDB();



//Passport Configuration
app.use(require("express-session")({
    secret: "why",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success"); 
    next();
});


app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);


//Port to listen
app.listen(3000,function(){
    console.log("Server is running");
});