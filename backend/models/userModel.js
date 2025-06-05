const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["Patient", "Doctor", "Admin"], required: true},
    image: {
        type: String, 
        default: 'https://m.media-amazon.com/images/I/41ONa5HOwfL.jpg'
    },
    specialization: { type: String },
    experience: { type: Number },
    availableTime: { type: [String]},
    createdAt: { type: Date, default: Date.now },
})

const userModel = mongoose.model("hospital_collection", userSchema)


module.exports = userModel