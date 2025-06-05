const express = require("express")
const { verifyToken, updateDoctor, uploadImage, getAppointment, updateAppointment, sendPrescription } = require("../controllers/doctorController")
const doctorrouter = express.Router()

doctorrouter.get("/doctor/:id",verifyToken )
doctorrouter.post("/update/:id", updateDoctor)
doctorrouter.post("/upload/:id",  uploadImage )
doctorrouter.get("/doctor_appointment/:id", getAppointment)
doctorrouter.put("/your_appointment/:id/status", updateAppointment)
doctorrouter.post("/prescription/:id", sendPrescription)



module.exports = doctorrouter