const mongoose = require("mongoose")

const usersResponsibilitiesSchema = new mongoose.Schema({
    userId: {type: String, required:true, unique: true},
    usersLocations: {type: Array, required:true}
})

module.exports = usersResponsibility = mongoose.model("usersResponsibility", usersResponsibilitiesSchema)