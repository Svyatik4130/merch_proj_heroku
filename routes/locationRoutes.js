const router = require("express").Router()
const Location = require("../models/locationModel")
const User = require("../models/userModel")
const usersResponsibility = require("../models/usersresposblModel")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const { replaceOne } = require("../models/locationModel")

router.post("/add", auth, async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user)
        if (loggedUser.roleId !== 1) {
            return res.status(400).json({ msg: "Only admins can add locations" })
        }
        console.log(req.body)
        const address = req.body.value

        if (!address) {
            return res.status(400).json({ msg: "not all fields have been entered" })
        }
        if (address.length < 5) {
            return res.status(400).json({ msg: "address length has to be at least 5 characters long" })
        }
        const isAddUniq = await Location.findOne({ address: address })
        if (isAddUniq) {
            return res.status(400).json({ msg: "an address with this name is already exists" })
        }
        let allLocations = await Location.find({})
        allLocations.sort((first, second) => {
            return second.id - first.id
        })
        if (allLocations.length === 0) {
            allLocations = [{ id: -1 }]
        }
        const newLocation = new Location({
            id: allLocations[0].id + 1,
            address
        })

        const savedLocation = await newLocation.save()
        res.json(savedLocation)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

router.get("/alllocations", async (req, res) => {
    const allLocations = await Location.find({})

    res.json(allLocations)
})
router.get("/getResponsibilities", async (req, res) => {
    const Responsibilities = await usersResponsibility.find({})

    res.json(Responsibilities)
})
router.post("/getExactResponsibility", async (req, res) => {
    const Responsibilities = await usersResponsibility.find({})

    const exactResponsibility = Responsibilities.find(Responsibility => Responsibility.userId == req.body.userID)

    if (!exactResponsibility) {
        const newarr = {usersLocations: []}
        res.json(newarr)
    } else {
        res.json(exactResponsibility)

    }

})

router.post("/setLocationForUser", auth, async (req, res) => {
    const isExists = await usersResponsibility.findOne({ userId: req.body[0]._id })

    console.log(isExists)

    if (isExists === null) {
        const newResponsibility = new usersResponsibility({
            userId: req.body[0]._id,
            usersLocations: req.body[1]
        })
        const savedResponsibility = await newResponsibility.save()
        res.json(savedResponsibility)
    } else {
        const replacement = await usersResponsibility.replaceOne({ userId: req.body[0]._id }, {
            userId: req.body[0]._id,
            usersLocations: req.body[1]
        })
        res.json(replacement)
    }
})

router.post("/deleteLocation", auth, async (req, res) => {
    try {
        const isAdmin = await User.findById(req.user)
        if (isAdmin.roleId !== 1) {
            return res.status(400).json({ msg: "Only admin can delete user" })
        }
        console.log(req.body.locId)
        const deletedLocation = await Location.findByIdAndDelete(req.body.locId)


        res.json(deletedLocation)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

module.exports = router
