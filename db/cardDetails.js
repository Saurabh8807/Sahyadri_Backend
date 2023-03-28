const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    cardHolderName:String,
    cardNumber:Number,
    expiryDate:Date,
    cvv:Number,
    

})

module.exports=mongoose.model('cardDetails',userSchema)








