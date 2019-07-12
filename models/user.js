const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    userSchema = new mongoose.Schema({
        username: {type:String,required:true,unique:true},
        password: String,
	isAdmin: {type:boolean,default: false}
    });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);








