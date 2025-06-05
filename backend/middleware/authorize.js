const userModel = require("../models/userModel");

const authorize = (roles) => (req, res, next) =>{
    if (!roles.includes(req.body.role)){
        return res.status(403).send("Forbidden")
    }
    next()

}

module.exports = {authorize}