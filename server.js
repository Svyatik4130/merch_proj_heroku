const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const path = require('path');

const app = express()
app.use(express.json())
// app.use(cors())
const PORT = process.env.PORT || 6000

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) throw err;
    console.log("MONGODB CONNECTED")
})


app.use("/users", require("./routes/userRouter"))
app.use("/report", require("./routes/reportRoutes"))
app.use("/locations", require("./routes/locationRoutes"))

if (process.env.NODE_ENV === "production") {
    app.use(express.static("front/build"))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "front", "build", "index.html"))
    })
}

app.listen(PORT, () => console.log(`the server started at ${PORT}`))
