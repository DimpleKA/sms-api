const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Endpoint to handle incoming POST requests
app.post('/send-sms', (req, res) => {
    // Extract data from the request body
    const { to, otp, message, authToken } = req.body;

    // Check if authToken is provided
    if (!authToken) {
        return res.status(400).json({ error: 'Auth token is required' });
    }

    // Twilio credentials
    const accountSid = 'AC30d1486afa066c1428fa9d1ca02014b3';
    
    // Create Twilio client using accountSid and authToken
    const twilioClient = twilio(accountSid, authToken);

    // Generate the message body including the OTP
    const messageBody = `${message} OTP: ${otp}`;

    // Send SMS using Twilio
    twilioClient.messages.create({
        body: messageBody,
        from: '+13416997825', // Replace with your Twilio phone number
        to: to
    })
    .then(message => {
        console.log('Message sent successfully:', message.sid);
        res.json({ success: true, messageSid: message.sid });
    })
    .catch(error => {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Error sending message' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
