const jwt = require("jsonwebtoken")
const router = require("../routes/userRouter")

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token")
        // console.log('22', token)
        if (!token) {
            return res.status(401).json({ msg: "no authentication token, authorisation denied" })
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET)

        if(!verified) {
            return res.status(401).json({ msg: "Token authentification denied" })
        }
        // console.log(verified)
        req.user = verified.id
        // console.log("11", req.user)
        next()
    } catch (err) {
        res.status(500).json(err.message)
    }
}

module.exports = auth
