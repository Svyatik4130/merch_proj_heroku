const router = require("express").Router()
const Location = require("../models/locationModel")
const User = require("../models/userModel")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

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
        if(allLocations.length === 0){
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

module.exports = router
