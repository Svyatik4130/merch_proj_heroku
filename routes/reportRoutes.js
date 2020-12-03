const express = require("express")
const router = express()
const fileUpload = require("express-fileupload")
const path = require('path')
const locationReport = require("../models/locationReportsModel")
const User = require("../models/userModel")
const auth = require("../middleware/auth")
const { type } = require("os")
const { json } = require("express")


router.use(fileUpload());

router.post('/add', auth, async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).json({ msg: "You have to login/register first" })
        }
        // if (req.body.images == "[]") {
        //     return res.status(400).json({ msg: "No file uploaded" })
        // }

        console.log(req)
        console.log(req.files.file)
        // const { reportValue, locTitle, userName, date, images } = req.body
        // if (reportValue.length < 5) {
        //     return res.status(400).json({ msg: "The report description has to be more that 5 symbols" })
        // }

        res.json(req.files.file)
        // const nameOfImage = `${req.user}_${date}`

        // file.mv(`${__dirname}/../front/public/uploads/${nameOfImage}.png`, err => {
        //     if (err) {
        //         console.log(err)
        //         return res.status(500).send(err)
        //     }

        //     // res.json({ FileName: file.name, FilePath: `/uploads/${nameOfImage}` })
        // })

        // let allReports = await locationReport.find({})
        // allReports.sort((first, second) => {
        //     return second.id - first.id
        // })
        // if(allReports.length === 0){
        //     allReports = [{ id: -1 }]
        // }
        // const newReport = new locationReport({
        //     id: allReports[0].id + 1,
        //     reportTitle: reportValue,
        //     locationTitle: locTitle,
        //     reporterID: req.user,
        //     reporterName: userName,
        //     date: date,
        //     images: JSON.parse(images)
        // })
        // const savedReport = await newReport.save()
        // res.json(savedReport)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get("/getallreports", auth, async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user)
        if (loggedUser.roleId !== 1) {
            return res.status(400).json({ msg: "Only admins can add locations" })
        }

        const allReports = await locationReport.find({})
        res.json(allReports)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router