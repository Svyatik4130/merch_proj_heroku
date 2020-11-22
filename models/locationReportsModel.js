const mongoose = require("mongoose")

const locationReportsSchema = new mongoose.Schema({
    id: {type: Number, required:true, unique: true},
    reportTitle: {type: String, required: true, minlength: 5},
    locationTitle: {type: String, required: true, minlength: 5},
    reporterID: {type: String, required: true},
    reporterName: {type: String, required: true},
    date: {type: String, required: true},
    imageName: {type: String, required: true}
})

module.exports = locationReport = mongoose.model("locationReport", locationReportsSchema)
