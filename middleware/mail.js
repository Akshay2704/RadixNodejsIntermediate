var nodemailer = require("nodemailer");
var smtpConfig = {
  host: "mail.mailtest.radixweb.net",
  port: 465,
  auth: {
    user: "testphp@mailtest.radixweb.net",
    pass: "Radixweb8",
  },
};
const transporter = nodemailer.createTransport(smtpConfig);
module.exports = transporter;
