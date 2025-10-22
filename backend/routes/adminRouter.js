const express = require("express")
const { verifyAdmin,  getAll, postProduct, getProduct, deleteAppointment, deleteProduct, updateProduct } = require("../controllers/adminController")
const adminrouter = express.Router()

adminrouter.get("/admin/:id", verifyAdmin )
adminrouter.get("/get_all", getAll)
adminrouter.get("/get_products", getProduct)
adminrouter.post("/post_item", postProduct)
adminrouter.delete("/appointments/:id", deleteAppointment)
adminrouter.delete("/delete_product/:id", deleteProduct)
adminrouter.put("/update_product/:id", updateProduct)



module.exports = adminrouter