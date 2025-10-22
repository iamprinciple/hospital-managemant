const userModel = require("../models/userModel");
// const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require('../utils/cloudinary');
const appointmentModel = require("../models/appointmentModel");
const approvedMail = require("../utils/mailer");
const prescriptionModel = require("../models/prescribtionModel");

let secretkey = "western"

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const { id } = req.params

        if (!token || !id) {
            res.status(400).send({ message: "invalid token", status: false })
        }
        const verified = jwt.verify(token, secretkey)
        if (!verified) {
            res.status(402).send({ message: "Invalid entry! Login again", status: false })
        }
        const doctor = await userModel.findById(verified.existingUser._id)

        if (!doctor || doctor.role !== "Doctor") {
            return res.status(403).send({ message: "Unauthorized Entry", status: false })
        } else {
            return res.status(200).send({ message: "User details fetched successfuly", status: true, doctor })

        }


        next()
    } catch (error) {
        // console.log(error);
        if (error.message == "jwt malformed") {
            res.status(501).send({ message: "Incorrect token", status: false })
        }
        return res.status(500).send({ message: `internal server error ${error.message}`, status: false })
    }
}

// const getUser = async (req, res) =>{
//     try {
//         const {id} = req.params

//         const user = await userModel.findById(id).select('-password');
//         // console.log(user);

//         if (!user) {
//             return res.status(404).send({message: "No user", status: false})
//         }else{
//             return res.status(200).send({message: "User details fetched successfuly", status: true, user})
//         }

//     } catch (error) {
//         console.log(error);

//         return res.status(500).send({message: "server error", status: false}) 
//     }
// }
const updateDoctor = async (req, res) => {
    try {
        const { specialization, experience, availableTime } = req.body

        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "Missen ID", status: false });
        }
        // if (!specialization || !experience || !availableTime) {
        //     return res.status(400).send({ message: "Input missen fields", status: false });   
        // }else{
        const updated = await userModel.findByIdAndUpdate(
            id,
            { specialization, experience, availableTime },
            { new: true }
        )
        console.log(updated);
        
        if (!updated) {
            return res.status(401).send({ message: "Error updating", status: false });
        } else {
            res.status(200).send({ message: "update successful", status: true, updated })
        }
        // }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })
    }


}
const getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);

        if (!id) {
            return res.status(400).json({ message: "User ID is required", status: false });

        }
        const docAppointment = await appointmentModel.find({ doctorId: id })
        // console.log(docAppointment);
        if (!docAppointment) {
            return res.status(404).send({ message: "No appointment found", status: false })
        } else {
            return res.status(200).send({ message: "Appointment fetched successfuly", status: true, docAppointment })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })

    }
}
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params
        const { status, allAppointment } = req.body


        if (!status) {
            return res.status(400).json({ message: "Status is required", status: false });
        }
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found", status: false });
        } else {
            for (const appointment of allAppointment) {
                if (appointment?.patientEmail) {
                    console.log("Sending to:", appointment.patientEmail);
                    await approvedMail(appointment.patientFirstname, status, appointment.doctorEmail, appointment.patientEmail)
                }

            }

            res.status(200).json({ message: "Appointment status updated", status: true, data: updatedAppointment });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", status: false });
    }
}
const sendPrescription = async (req, res) => {
    try {
        const { id } = req.params
        const { prescription, patientList } = req.body
        console.log(prescription);
        console.log(patientList[0].doctorId);



        const newPrescription = await prescriptionModel.create({
            patient: id,
            doctorId: patientList[0].doctorId,
            prescription
        })
        if (newPrescription) {
            res.status(201).json({ message: "Prescription sent", status: true });
        } else {
            res.status(400).json({ message: "Cant create appointment", status: false });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", status: false });
    }

}
const uploadImage = async (req, res) => {
    try {
        const { img } = req.body
        const { id } = req.params
        if (!img || !id) {
            return res.status(400).send({ message: "Select an Image to upload", status: false });
        }
        const user = await userModel.findById(id).select('-password');
        const uploaded = await cloudinary.uploader.upload(img)

        if (!uploaded) {
            res.status(400).send({ message: "Unable to upload image", status: false })
        } else {
            const uploadSuccess = await userModel.findByIdAndUpdate(
                id,
                { $set: { image: uploaded.secure_url } })
            if (!uploadSuccess) {
                res.status(400).send({ message: "Error while uploading", status: false })
            } else {
                res.status(200).send({ message: "Update successful", status: true })
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })
    }
}
module.exports = { verifyToken, updateDoctor, uploadImage, getAppointment, updateAppointment, sendPrescription }