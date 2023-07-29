const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
    },
    roomNumber: {
        type:Number,
        require:true,
    },
    phoneNumber: {
        type:Number,
        require:true,
    },
    guests: {
        type:Number,
        require:true,
    },
    time: {
        type:String,
        require:true,
    },
    items:{
        type:String,
        require:false,
    },

})

module.exports=mongoose.model('tableRequest',userSchema)
