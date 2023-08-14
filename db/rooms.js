const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    No: {
        type: Number,
        required: true,
    },
    Names: {
        type: String,
        required: true,
    },
    arrival_date_year: {
        type: Number,
        required: true,
    },
    arrival_date_month: {
        type: String,
        required: true,
    },
    arrival_date_day_of_month: {
        type: Number,
        required: true,
    },
    stays_in_weekend_nights: {
        type: Number,
        required: true,
    },
    stays_in_week_nights: {
        type: Number,
        required: true,
    },
    adults: {
        type: Number,
        required: true,
    },
    children: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    Booking_Type: {
        type: String,
        required: true,
    },
    reserved_room_type: {
        type: String,
        required: true,
    },
    assigned_room_type: {
        type: String,
        required: true,
    },
    days_in_waiting_list: {
        type: Number,
        required: true,
    },
    billAmount: {
        type: Number,
        required: true,
    },
    required_car_parking_spaces: {
        type: Number,
        required: true,
    },
    total_of_special_requests: {
        type: Number,
        required: true,
    },
    reservation_status: {
        type: String,
        required: true,
    },
    reservation_status_date: {
        type: String,
        required: true,
    },
    Guest: {
        type: String,
        required: true,
    },
    Occupancy_Status: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('rooms', reservationSchema)
