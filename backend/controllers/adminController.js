const appointmentModel = require("../models/appointmentModel");
const pharmacyModel = require("../models/pharmacyModel");
const userModel = require("../models/userModel");
// const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

let secretkey = "western"

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const { id } = req.params

        if (!token || !id) {
            return res.status(400).send({ message: "invalid token", status: false })
        }
        const verified = jwt.verify(token, secretkey)
        // console.log(verified.existingUser._id);

        if (!verified) {
            return res.status(402).send({ message: "Invalid entry! Login again", status: false })
        }
        const admin = await userModel.findById(verified.existingUser._id)
        // console.log(admin);

        if (!admin || admin.role !== "Admin") {
            return res.status(403).send({ message: "Unauthorized Entry", status: false })
        } else {
            return res.status(200).send({ message: "User details fetched successfuly", status: true, admin })

        }

        next();
    } catch (error) {
        return res.status(501).send({ message: "Incorrect token", status: false, error })



    }
}

// const getAdmin = async (req, res) =>{
//     try {
//         const {id} = req.params

//         const user = await userModel.findById(id).select('-password');

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
const getAll = async (req, res) => {
    try {
        const doctors = await userModel.find({ role: "Doctor" })
            .select("firstname lastname email specialization experience image availableTime createdAt role")
        // console.log(doctors);
        const patient = await userModel.find({ role: "Patient" })
            .select("firstname lastname email image role createdAt")
        // console.log(patient);
        const allAppointments = await appointmentModel.find()
        // console.log(allAppointments);

        if (!doctors) {
            return res.status(404).send({ message: "No doctors yet", status: false })
        }
        if (!patient) {
            return res.status(404).send({ message: "No patient yet", status: false })
        }
        if (!allAppointments) {
            return res.status(404).send({ message: "No appointment found", status: false })

        }
        return res.status(200).send({ message: "Details fetched successfuly", status: true, doctors, patient, allAppointments })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error fetching details", status: false })

    }
}
const postProduct = async (req, res) => {
    try {
        // console.log(req.body);
        const { prodName, img, price, qty } = req.body
        const products = await pharmacyModel.create({
            prodName,
            img,
            price,
            qty
        })

        if (!products) {
            return res.status(402).send({ message: "error posting product", status: false })
        } else {
            return res.status(200).send({ message: "Posting successful", status: true, products })
        }

    } catch (error) {
        return res.status(500).send({ message: 'Network error, please try again', status: false })

    }


}
const getProduct = async (req, res) => {
    try {
        const pharmacy = await pharmacyModel.find()
        // console.log(pharmacy);
        if (!pharmacy) {
            return res.status(404).send({ message: "Nothing posted yet", status: false })

        }
        return res.status(200).send({ message: "Products fetched successfuly", status: true, pharmacy })


    } catch (error) {
        console.log(error);

    }
}
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const deleted = await appointmentModel.findByIdAndDelete(id)
        return res.status(200).send({ message: "Appointment deleted successfully", status: true, deleted })
    } catch (error) {
        return res.status(404).send({ message: "Not deleted yet", status: false })

    }

}
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const deleted = await pharmacyModel.findByIdAndDelete(id)
        return res.status(200).send({ message: "Products deleted successfully", status: true, deleted })
    } catch (error) {
        return res.status(404).send({ message: "Not  deleted yet", status: false })

    }



}
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const updated = await pharmacyModel.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        if (!updated) {
            return res.status(404).send({ message: "Not  deleted yet", status: false })

        }
        return res.status(200).send({ message: "Products update successfully", status: true, updated })

    } catch (error) {
        return res.status(500).send({message:"Server error", status:false})
    }
}
module.exports = { verifyAdmin, getAll, postProduct, getProduct, deleteAppointment, deleteProduct, updateProduct }
