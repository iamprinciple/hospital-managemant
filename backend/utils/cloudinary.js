const cloudinary = require("cloudinary").v2

cloudinary.config({ 
    cloud_name: 'dadz8457z', 
    api_key: process.env.APIKEY, 
    api_secret: process.env.API_SECRET
});

module.exports = cloudinary