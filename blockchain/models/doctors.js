const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema =new Schema({

    date         : { type : Date, default : Date.now },
    obsnsamp     : { type : String, required : true },
    report       : { type : String, required : true },
    labtech_name : { type : mongoose.Schema.Types.ObjectId, ref : 'User' }
    
});


var doctorSchema = new Schema({
    
    date         : { type : Date , default : Date.now },
    observation  : { type : String, required : true },
    disease      : { type : String, required : true },
    prescription : { type : String, required : true },
    labreports   : [reportSchema],
    hspid        : { type : String, required : true },
    doctor_name  : { type : mongoose.Schema.Types.ObjectId, ref : 'User' }

});

const Doctors = mongoose.model('Doctor', doctorSchema);

module.exports = Doctors;