const nodemailer = require("nodemailer");

// Nodemailer, but fully env-driven so it can use an SMTP relay on port 2525.
// Render's free tier blocks the standard SMTP ports (25/465/587) - which caused
// the "Connection timeout" - but relays like Brevo/SendGrid also listen on 2525,
// which cloud hosts usually allow. Gmail does NOT offer 2525, so on Render you
// point MAIL_HOST at a relay (e.g. smtp-relay.brevo.com) with MAIL_PORT=2525.
const mailSender = async (email, title, body) => {
  try {
    const port = Number(process.env.MAIL_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: port,
      secure: port === 465, // true only for 465; false for 587/2525
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || `CodeScholar <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.log("mailSender error:", error.message);
    return null;
  }
};

module.exports = mailSender;
