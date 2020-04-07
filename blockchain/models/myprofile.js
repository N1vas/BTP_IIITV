const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var reportSchema =new Schema({

    date         : { type : Date, default : Date.now },
    obsnsamp     : { type : String, required : true },
    report       : { type : String, required : true },
    labtech_name : { type : String }
    
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
    doctor_name  : { type : String, required : true },
    class_type   : { type : String, required : true }

});

var blockSchema = new Schema({

    cbhash : { type : String },
    pbhash : { type : string }

});

var myprofileSchema = new Schema({

    firstname : { type : String, required : true },
    lastname : { type : String, required : true },
    dob : { type : String, required : true },
    gender : { type : String, required : true },
    locality : { type: String},
    city : { type:String },
    doctorvisit : [doctorSchema],
    blockadd : [blockSchema]

});

const Myprofiles = mongoose.model('Myprofile', myprofileSchema);

module.exports = Myprofiles;

// {
// 	"firstname": "ggj",
// 	"lastname":"nivas",
// 	"dob": "08-11-1998",
// 	"gender":"male"
// }

// {
	
//     "observation"  : "weakness, dull",
//     "disease"      : "depression",
//     "prescription" :"yoga practice",
    
//     "hspid"        : "ALK001"
// }