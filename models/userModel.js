const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {type: String, required:true, unique: true},
    password: {type: String, required: true, minlength: 5},
    phone: {type: String, required: true, minlength: 6, unique: true},
    address: {type: String, required: true, minlength: 3},
    displayName: {type: String, unique: true},
    roleId: {type: Number, required: true},
    pending: {type: Boolean, required: true}
})

module.exports = user = mongoose.model("user", userSchema)
