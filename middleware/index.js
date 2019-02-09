const Campground = require("../models/campground"),
        Comment  = require("../models/comments");
//Middleware stuff
var middleWareObj = {};
middleWareObj.checkCampgroundOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCamp)=>{
            if(err){
                req.flash("error","Something went Wrong");
                res.redirect("back");
            }else{
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have permissions");
                    res.redirect("back");
                }
                
            }
        });
    }else{
        req.flash("error","Login to continue");
        res.redirect("back");
    }
}

middleWareObj.checkCommentOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,(err,foundComment)=>{
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                } 
            }
        });
    }else{
        req.flash("error","Login to continue");
        res.redirect("back");
    }
}

middleWareObj.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must login first");
    res.redirect("/login");
}
module.exports = middleWareObj;