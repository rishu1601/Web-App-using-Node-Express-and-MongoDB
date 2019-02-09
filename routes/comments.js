const express = require("express"),
      router  = express.Router({mergeParams: true}),
      Campground = require("../models/campground"),
      Comment    = require("../models/comments"),
      middleWare = require("../middleware");

//================
//COMMENT ROUTES
//================


router.get("/new", middleWare.isLoggedIn , function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log("Failed");
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
});

router.post("/",middleWare.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment and save it
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});



//Edit a comment

//Edit form
router.get("/:commentId/edit",middleWare.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.commentId,(err,foundComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
});
//Comment update
router.put("/:commentId",middleWare.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,(err,updatedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id); 
        }
    });
});

//Delete a comment
router.delete("/:commentId",middleWare.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndRemove(req.params.commentId,(err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","comment deleted succesfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});


module.exports = router;