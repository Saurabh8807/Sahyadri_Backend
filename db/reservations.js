const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
    },
    email: {
        type:String,
        require:true,
    },
    phone: {
        type:Number,
        require:true,
    },
    address: {
        type:String,
        require:true,
    },
    date1: {
        type:String,
        require:true,
    },
    date2:{
        type:String,
        require:true,
    },
    adults: {
        type:String,
        require:true,
    },
    childrens: {
        type:String,
        require:true,
    },
    rooms: {
        type:String,
        require:true,
    },
    roomType: {
        type:String,
        require:true,
    },

})

module.exports=mongoose.model('reservations',userSchema)








