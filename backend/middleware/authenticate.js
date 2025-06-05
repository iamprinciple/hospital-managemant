const jwt = require('jsonwebtoken')

let secretkey = "western"
const authenticate = (roles) => async (req, res, next)=>{
    console.log(req.body);
    
    try {
        const token = req.headers.authorization?.split(" ")[1]
        console.log(token);
        
        if (!token) {
            res.status(400).send({ message: "invalid token", status: false })
        }
        const verified = jwt.verify(token, secretkey)
        if (!roles.includes(verified.role)) {
            res.status(403).send({message: "Forbidden: Access denied!"})
        }
        req.user = verified
        // const userRole = verified.role   ********TAKE NOTE*****
        // console.log(verified);

        next()
    } catch (error) {
        console.log(error);
        if (error.message == "jwt malformed") {
            res.status(501).send({ message: "Incorrect token", status: false })
        }
        res.status(500).send({ message: `internal server error ${error.message}`, status: false })
    }
}

// module.exports = {authenticate}