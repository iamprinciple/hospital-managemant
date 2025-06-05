const mongoose = require('mongoose')

const dbConnect = async()=>{
    try {
        const connection = await mongoose.connect(process.env.URI)
        if (connection) {
            console.log("Connected to server");
            
        }
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = dbConnect