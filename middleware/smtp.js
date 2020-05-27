const nodemailer = require("nodemailer");
var dotenv = require('dotenv');
dotenv.config();

const smtpTransport = nodemailer.createTransport( {
    host: 'smtp.office365.com',
    port: 587,
      auth: {
        user: process.env.sendEmail,
        pass: process.env.sendPassword
      },
      secureConnection: false,
      tls: { ciphers: 'SSLv3' }
    });

    module.exports = smtpTransport