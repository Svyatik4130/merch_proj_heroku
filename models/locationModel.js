const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    id: {type: Number, required:true, unique: true},
    address: {type: String, required: true, minlength: 5, unique: true}
})

module.exports = location = mongoose.model("location", locationSchema)
