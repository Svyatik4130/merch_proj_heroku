const router = require("express").Router()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res) => {
    try {
        const { email, password, passwordCheck, displayName, phone, address } = req.body

        if (!email || !password || !passwordCheck) {
            return res.status(400).json({ msg: 'Not all fields have been entered' })
        }
        if (password.length < 5) {
            return res.status(400).json({ msg: "pass need to be at least 5 characters long" })
        }
        if (passwordCheck !== password) {
            return res.status(400).json({ msg: "enter the same password" });
        }

        const existingUserWithSuchEmail = await User.findOne({ email: email })
        if (existingUserWithSuchEmail) {
            return res.status(400).json({ msg: "an account with this email is already exists" })
        }

        let newName = ""
        if (!displayName) { newName = email } else {newName = displayName}

        const existingUserWithSuchName = await User.findOne({ displayName: email })
        if (existingUserWithSuchName) {
            return res.status(400).json({ msg: "an account with such name is already exists" })
        }
        
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            email,
            password: passwordHash,
            displayName: newName,
            phone,
            address,
            roleId: 0,
            pending: true
        })
        const savedUser = await newUser.save()
        res.json(savedUser)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: "not all fields have been entered" })
        }
        const userAcc = await User.findOne({ email: email })
        if (!userAcc) {
            return res.status(400).json({ msg: "No account with this email has been registered " })
        }

        const isMatch = await bcrypt.compare(password, userAcc.password)
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid cerdentials" })
        }

        const token = jwt.sign({ id: userAcc._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: userAcc._id,
                displayName: userAcc.displayName,
                role: userAcc.roleId,
                pending: userAcc.pending
            }
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.post("/deleteUser", auth, async (req, res) => {
    try {
        const isAdmin = await User.findById(req.user)
        if (isAdmin.roleId !== 1) {
            return res.status(400).json({ msg: "Only admin can delete user" })
        }
        const deletedUser = await User.findByIdAndDelete(req.body.userID)

        res.json(deletedUser)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token")
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.displayName,
        id: user.id,
        role: user.roleId,
        email: user.email,
        phone: user.phone,
        address: user.address,
        pending: user.pending
    })
})
router.post("/acceptuser", auth, async (req, res) => {
    const isAdmin = await User.findById(req.user)
    if (isAdmin.roleId !== 1) {
        return res.status(400).json({ msg: "Only admin can delete user" })
    }

    const user = await User.findById(req.body.userId);
    user.pending = false

    const replacedUser = await User.replaceOne({_id: req.body.userId}, user)
    res.json(replacedUser)
})

router.get("/getallusers", async (req, res) => {
    const allUsers = await User.find({})
    res.json(allUsers)
})

module.exports = router
