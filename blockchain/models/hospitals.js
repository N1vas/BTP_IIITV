const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//var passportLocalMongoose = require('passport-local-mongoose');

const doctorSchema = new Schema({

    doctor_name : { type: String, required: true },
    specialization : { type: String, required: true }
    
});


const hospitalSchema = new Schema({
    
    hspid : { type: String, required: true, unique:true },
    hospital_name : { type: String, required: true, unique : true },
    description : { type: String, required: true },
    doctors : [doctorSchema]
   
   
    
});

const Hospitals = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospitals;