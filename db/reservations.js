const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    address:String,
    date1:String,
    date2:String,
    adult:String,
    rhildres:String,
    rooms:String,
    roomType:String,

})

module.exports=mongoose.model('reservations',userSchema)








