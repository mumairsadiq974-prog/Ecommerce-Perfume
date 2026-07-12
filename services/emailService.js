const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Sadi Fragrances - Admin Password Reset",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8e8e1;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; color: #111;">Sadi Fragrances</h1>
          <p style="color: #888; font-size: 14px;">Admin Password Reset</p>
        </div>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">You requested a password reset for your admin account.</p>
        <p style="font-size: 16px; color: #444; line-height: 1.6;">Click the button below to reset your password. This link expires in 30 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background-color: #111; color: #fff; text-decoration: none; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #888; line-height: 1.6;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e8e8e1; margin: 30px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">Sadi Fragrances Pakistan</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };