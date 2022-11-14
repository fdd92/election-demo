const nodemailer = require('nodemailer');
const console = require('console');
const mail = require('../config/mail');

const transporter = nodemailer.createTransport({
  host: mail.host,
  port: mail.port,
  secure: true,
  auth: {
    user: mail.user,
    pass: mail.pass,
  },
});

const sendMail = async (toEmail, subject, html) => {
  const option = {
    from: mail.sendMail,
    bcc: toEmail,
    subject,
    html,
  };
  console.log(option);
  transporter.sendMail(option, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(info);
    }
  });
};

module.exports = {
  sendMail,
};
