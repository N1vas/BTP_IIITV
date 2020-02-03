const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema =new Schema({

    date        : { type : Date, default : Date.now },
    obsnsamp    : { type : String, required : true },
    report      : { type : String, required : true },
    labtech     : { type : String, required : true }
    
});


var doctorSchema = new Schema({
    
    date         : { type : Date , default : Date.now },
    observation  : { type : String, required : true },
    disease      : { type : String, required : true },
    prescription : { type : String, required : true },
    labreports   : [reportSchema],
    hspid        : { type : String, required : true }

});

const Doctors = mongoose.model('Doctor', doctorSchema);

module.exports = Doctors;