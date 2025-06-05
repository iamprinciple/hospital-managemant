const nodemailer = require("nodemailer")



const approvedMail = async(pName, status, dMail, pMail )=>{
    try {
         const messageTemp = `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }
        h2 {
            color: #2c3e50;
        }
        .details {
            background: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Appointment Status</h2>
        <p>Dear <strong>${pName}</strong>,</p>
        <p>Your appointment has been <strong>${status}</strong>. Check your dashboard for more details.</p>
        <p>If you have any questions, feel free to contact the doctor <strong>${dMail}</strong> .</p>
        <p class="footer">Best regards</p>
    </div>
</body>
</html>

    `

    const transporter = await nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.MAIL,
            pass:process.env.MAIL_PASS
        }
    })
    const mailOptions = {
        from:process.env.MAIL,
        to: pMail,
        subject: "Appointment Status Changed",
        text: "Check your dashboard",
        html: messageTemp
    }

        await transporter.sendMail(mailOptions)
        console.log("Mail sent!");
    } catch (error) {
        console.log(error);
        
    }
   
    
}

module.exports = approvedMail