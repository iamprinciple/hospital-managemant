const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel")
// const patientModel = require("../models/patientModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require('../utils/cloudinary');
const prescriptionModel = require("../models/prescribtionModel");
const pharmacyModel = require("../models/pharmacyModel");
const transactionModel = require("../models/trnsactionModel")
const axios = require('axios');
require('dotenv').config();


const getSignup = async (req, res) => {
    try {
        // console.log(req.body);
        const { firstname, lastname, email, password, role } = req.body
        const existingUser = await userModel.findOne({email})
        if (existingUser) {
            return res.status(400).send({ message: "Email already registered", status: false })
        }
        if (!firstname || !lastname || !password || !role || !email) {
           return res.status(400).send({ message: "All fields are mandatory", status: false })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await userModel.create({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role
            })
            if (!user) {
                res.status(402).send({ message: "error creating user", status: false })
            } else {
                return res.status(200).send({ message: "Sign up success", status: true })
            }
        }

    } catch (error) {
       return res.status(500).send({ message: 'Network error, please try again', status: false })
    }

}


let secretkey = process.env.SECRETKEY
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ message: "All fields are mandatory", status: false })
        }
        const existingUser = await userModel.findOne({ email: email })
        if (!existingUser) {
            res.status(400).send({ message: "You are not a registered user", status: false })
        } else {
            const correctPassword = await bcrypt.compare(password, existingUser.password)

            if (!correctPassword) {
                res.status(402).send({ message: "Incorrect password", status: false })
            } else {
                const token = await jwt.sign({ email, existingUser }, secretkey, { expiresIn: "1day" })
                return res.status(200).send({ message: "Login success", status: true, token, existingUser })
            }
        }
    } catch (error) {
       return res.status(500).send({ message: 'Internal server error, try again', status: false })
    }

}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const {id} = req.params

        if (!token || !id) {
            res.status(400).send({ message: "invalid token", status: false })
        }
        const verified = jwt.verify(token, secretkey)
        if (!verified) {
            res.status(402).send({ message: "Invalid entry! Login again", status: false })
        }

        const user = await userModel.findById(verified.existingUser._id)
        // console.log(currentuser);


        if (!user || user.role !== "Patient") {
            return res.status(402).send({ message: "Unauthorized user", status: false })
        }else{
            return res.status(200).send({message: "User details fetched successfuly", status: true, user})

        }
       
        next()
    } catch (error) {
        return res.status(501).send({ message: "Incorrect token", status: false, error })
        
        
    }
}

// const getUser = async (req, res) =>{
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
        
//         res.status(500).send({message: "server error", status: false}) 
//     }
// }
const uploadImage = async(req, res) =>{
    try {
        const {img} = req.body
        const  {id} = req.params
        if (!img || !id) {
            return res.status(400).send({ message: "Select an Image to upload", status: false });
        }
        const uploaded = await cloudinary.uploader.upload(img)
       
        if (!uploaded) {
            res.status(400).send({ message: "unable to upload image", status: false })
        }else{
            const uploadSuccess = await userModel.findByIdAndUpdate(
                id,
                {$set:{image: uploaded.secure_url}})
            if (!uploadSuccess) {
                res.status(400).send({ message: "error while uploading", status: false }) 
            }else{
                res.status(200).send({ message: "update successful", status: true })
            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })   
    }
}
const getDoctors = async(req, res)=>{
    try {
        const doctors = await userModel.find({role: "Doctor"})
        .select("firstname lastname email specialization experience image availableTime")
        // console.log(doctors);
        
    if (!doctors) {
        return res.status(404).send({message: "No available doctors", status: false})
    }else{
        return res.status(200).send({message: "Doctors details fetched successfuly", status: true, doctors})
    }
    } catch (error) {
        return res.status(500).send({message: "Error fetching doctors", status: false})
        
    }
    
}
const bookAppointment = async(req, res)=>{
    try {
        const  {id} = req.params
    const {doctorId, doctorName, doctorEmail, aptType, reason, selectedTime,} = req.body
    if (!id || !doctorId || !doctorName || !doctorEmail || !aptType || !reason || !selectedTime) {
        return res.status(400).send({ message: "Invalid field", status: false });
    }
    const user = await userModel.findById(id).select('-password');

    const newAppointment = await appointmentModel.create({
        userId: id,
        patientfirstName: user.firstname,
        patientlastName: user.lastname,
        patientEmail: user.email,
        doctorId,
        doctorName,
        doctorEmail,
        aptType,
        reason,
        selectedTime

    })
    // console.log(newAppointment);
    
    if (newAppointment) {
        res.status(201).json({ message: "Appointment Created!", status: true });
    }else{
        res.status(400).json({ message: "Cant create appointment", status: false });   
    }
    // const notification = await notificationModel.create({
    //     patient: id,
    //     doctor: doctorId,
        
    // })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", status: false });
    }
    
    
}
const appointmentHistory = async(req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required", status: false });
        }
        const appointments = await appointmentModel.find({userId: id})
        // console.log(appointments);
        if (!appointments) {
            return res.status(404).json({ message: "No appointments found", status: false });
        }
         return res.status(200).json({ message: "Appointments retrieved", status: true, data: appointments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", status: false });
    
    }
}
const getPrescriptions = async(req, res) =>{
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required", status: false });
        }
        const prescriptions = await prescriptionModel.find({patient: id})
        // console.log(prescriptions);
        if (!prescriptions) {
            return res.status(404).json({ message: "No prescriptions found", status: false });
        }
        return res.status(200).json({ message: "Prescriptions retrieved", status: true, data: prescriptions });
        
    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: "Server error", status: false });
    }
}

const getProducts = async(req, res)=>{
    try {
        const pharmacy = await pharmacyModel.find()
        if (!pharmacy) {
            return res.status(404).send({message: "Nothing posted yet", status: false})
            
        }
        return res.status(200).send({message: "Details fetched successfuly", status: true, pharmacy})
    } catch (error) {
        console.log(error);
           
    }
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET
const makePayment = async(req, res)=>{
 try {

    const {firstname, lastname, email, prod , price} = req.body
    
    if (!prod || !price) {
        return res.status(400).send({ message: "Invalid field", status: false });
        
    }
    const response = await axios.post(
       'https://api.paystack.co/transaction/initialize',
       {
        firstname,
        lastname,
        email,
        amount: price * 100,
        metadata: {
            product: prod
        },
        callback_url: "http://localhost:3000/payment_success"
       },
       {
        headers:{
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },

       }
    );
    console.log(response.data);
    
    return res.status(200).json({status: true, message: "Payment initialized", data: response.data.data});
 } catch (error) {
    console.log("Payment init error:", error.message);
    return res.status(500).json({status: false,
      message: "Failed to initialize payment",
    });
 }   
}

const verifyPayment = async(req, res) =>{
    const {reference} = req.params;
    const {userId} = req.query     
    // console.log("REF", reference);
    
    if (!reference) {
        return res.status(400).json({ message: "Missing reference", status: false });
    }
    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
            headers:{
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            }
        })
        
        if (response.status && response.data.data.status === "success" ) {
            const oneTrx = response.data.data
            // console.log(oneTrx);

            const newOne = await transactionModel.create({
                userId,
                reference: oneTrx.reference,
                amount: oneTrx.amount / 100,
                currency: oneTrx.currency,
                status: oneTrx.status,
                customer: {
                    email: oneTrx.customer.email,
                    name: oneTrx.customer.first_name + " " + oneTrx.customer.last_name,
                },
                paid_at: oneTrx.paid_at
            })
            // await newOne.save()
            if (newOne) {
                return res.status(200).json({status: true, message: "Payment verified successfully", data: newOne}); 
            }
           
        } else{
            return res.status(400).send({ message: "Payment verification failed or incomplete", status: false });

        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Error verifying payment",
        });
        
    }
}
const allRecords = async(req, res) =>{
    try {
            const {id} = req.params
    // console.log(id);
    if (!id) {
        return res.status(400).json({ message: "User ID is required", status: false });
        
    }    
    const records = await transactionModel.find({userId: id})
    console.log(records);
    if (!records) {
        return res.status(404).send({ message: "No records found", status: false })
        
    }else{
        return res.status(200).send({ message: "Records fetched successfuly", status: true, records })

    }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "internal server error", status: false })
    }

    
}

module.exports = { getSignup, userLogin, verifyToken, uploadImage, getDoctors, bookAppointment, appointmentHistory, getPrescriptions, getProducts, makePayment, verifyPayment, allRecords }