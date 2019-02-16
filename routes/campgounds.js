const express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment    = require("../models/comments"),
    middleWare = require("../middleware");
//Index Route- Show all campgrounds
router.get("/",function(req,res){
    var noMatch = null;
    //Fetch campgrounds from the database directly
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex},function(err,allCamps){
            if(err){
                console.log(err);
            }
            else
            {
                if(allCamps.length<1)
                {
                    noMatch = 'No campgrounds found for this search query';
                }
                res.render("campground/index",{campgrounds:allCamps,noMatch:noMatch});
            }
        });
    }else{
        Campground.find({},function(err,allCamps){
            if(err){
                console.log(err);
            }
            else
            {
                res.render("campground/index",{campgrounds:allCamps,noMatch:noMatch});
            }
        });
    }
});


//CREATE - add new campground
router.post("/", middleWare.isLoggedIn , function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
      id:req.user._id,
      username: req.user.username
  };
  var newCamp = {name: name, img: image , description: description,author: author};
  //Create a new campground and add to database
   Campground.create(newCamp,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");   
        }
   }) ; 
});


//NEW -show form to create a new campground
router.get("/new",middleWare.isLoggedIn,function(req,res){
    res.render("campground/new");
});

//Show campground
router.get("/:id",function(req,res){
    //Find the campground id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        //console.log(foundCamp.name);
        if(err){
            console.log(err);
            res.redirect("back");
       }
        else{
            console.log(req.params.id);
            res.render("campground/show",{campground:foundCamp});
        }
    });
});

//Edit Campground
router.get("/:id/edit",middleWare.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
        res.render("campground/edit",{campground:foundCamp});
    });
});

//Update Campground
router.put("/:id",middleWare.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCamp)=>{
        res.redirect("/campgrounds/"+req.params.id);
    })
});


//Delete Campground
router.delete("/:id",middleWare.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
            res.redirect("/campgrounds");
    });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;