const express = require('express');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const app = express();

const transporte = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,  
      }
  
  });

// Define a route for the home page
app.post('/mail', (req, res) => {
  const to = req.query.to;
  const subject = req.query.subject;
  const text = req.query.text;

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

// Start the server listening on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
