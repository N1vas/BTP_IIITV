const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//var passportLocalMongoose = require('passport-local-mongoose');

const planSchema = new Schema({
    
    plan_code : { type: String, required: true, unique:true },
    plan_name : { type: String, required: true, unique : true },
    description : { type: String, required: true },
    isCustomPlan : { type: Boolean },
    isDefault : { type: Boolean },
    isActive : { type: Boolean }
    
});

const Plans = mongoose.model('Plan', planSchema);

module.exports = Plans;

// {
// 	"plan_code" :"PLAN1", 
//     "plan_name" : "FREE PLAN",
//     "description" :"default plan for all new users",
//     "isCustomPlan" : "TRUE",
//     "isDefault" : "TRUE",
//     "isActive" : "TRUE"
// }