const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var reportSchema =new Schema({

    date         : { type : Date, default : Date.now },
    obsnsamp     : { type : String, required : true },
    report       : { type : String, required : true },
    labtech_name : { type : mongoose.Schema.Types.ObjectId, ref : 'User' }
    
});

var repnameSchema = new Schema({

    reportname : { type : String, required : true },
    reportdata : [reportSchema]
});

var doctorSchema = new Schema({
    
    date         : { type : Date , default : Date.now },
    observation  : { type : String, required : true },
    disease      : { type : String, required : true },
    prescription : { type : String, required : true },
    labreports   : [repnameSchema],
    hspid        : { type : String, required : true },
    doctor_name  : { type : mongoose.Schema.Types.ObjectId, ref : 'User' }

});



var myprofileSchema = new Schema({

    firstname : { type : String, required : true },
    lastname : { type : String, required : true },
    dob : { type : String, required : true },
    gender : { type : String, required : true },
    doctorvisit : [doctorSchema]

});