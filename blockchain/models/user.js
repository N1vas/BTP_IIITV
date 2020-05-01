var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    
    firstname:{type:String},
    lastname : { type : String, required : true },
    dob : { type : String, required : true },
    gender : { type : String, required : true },
    locality : { type: String},
    city : { type:String },
    user_type : {type:String,default:"patient"}
    
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);