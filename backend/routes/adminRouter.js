const express = require("express")
const { verifyAdmin,  getAll, postProduct, getProduct } = require("../controllers/adminController")
const adminrouter = express.Router()

adminrouter.get("/admin/:id", verifyAdmin )
adminrouter.get("/get_all", getAll)
adminrouter.get("/get_products", getProduct)
adminrouter.post("/post_item", postProduct)



module.exports = adminrouter