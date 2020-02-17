var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    },
    doctor: {
        type: Boolean,default:false 
    },
    patient: {
        type: Boolean,default:false 
    },
    labtech : {
        type: Boolean,default:false 
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);