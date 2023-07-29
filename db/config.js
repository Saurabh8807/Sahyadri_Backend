const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:'./.env'})
const DB = process.env.CON_URL;
mongoose.connect(DB)