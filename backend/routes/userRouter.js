const express = require("express")
const userrouter = express.Router()

const {getSignup, userLogin, verifyToken, uploadImage, getDoctors, bookAppointment, appointmentHistory, getPrescriptions, getProducts, makePayment, verifyPayment, allRecords} = require("../controllers/userController")

userrouter.post("/signup", getSignup)
userrouter.post("/login", userLogin)
// userrouter.get("/verify", verifyToken)
// userrouter.get("/admin", authenticate(['Admin']), )
// userrouter.get("/doctor/:id", verifyToken, getUser)
// userrouter.get("/patient", authenticate(['Patient']), )
userrouter.get("/patient/:id", verifyToken )
userrouter.post("/upload/:id",  uploadImage )
userrouter.get("/get_doctors", getDoctors)
userrouter.post("/book_appointment/:id", bookAppointment)
userrouter.get("/get_appointment/:id", appointmentHistory)
userrouter.get("/doctor_prescriptions/:id", getPrescriptions)
userrouter.get("/get_products", getProducts)
userrouter.post("/make_payment", makePayment)

userrouter.get("/verify-payment/:reference", verifyPayment)
userrouter.get("/records/:id", allRecords)




module.exports = userrouter
