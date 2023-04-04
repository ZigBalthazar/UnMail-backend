const express = require('express');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 4 // limit each IP to 4 requests per windowMs
});

const transporte = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,  
      }
  
  });

// Define a route for the home page
app.post('/mail', (req, res) => {
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;

  const TEXT = `
  Anonymous Email via unmail.kehiy.ir
  This email is not associated with unmail.
  email:\n${text}
  `

  if (typeof (to) !== "string") {
    return res.json({
      "msg": "to input is invalid"
    }).status(400);
  }
  if (typeof (subject) !== "string") {
    return res.json({
      "msg": "subject input is invalid"
    }).status(400);
  }
  if (typeof (text) !== "string") {
    return res.json({
      "msg": "text input is invalid"
    }).status(400);
  }
  try {
    transporte.sendMail({
      from: 'unmail@kehiy.ir',
      to,
      subject,
      text:TEXT
    });
    return res.json({
      "msg": "email was sent."
    }).status(201);
  } catch (error) {
    res.json({
      "msg": "email was not send!"
    }).status(500);
  }
});

// Start the server listening
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT||3000}`);
});
