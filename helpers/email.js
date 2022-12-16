import nodemailer from "nodemailer";

export const emailRegister = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, surname, token } = data;
  // Enviando email
  const info = await transporter.sendMail({
    from: '"Drivers Manager"', // sender address
    to: email, // list of receivers
    subject: "Check your account", // Subject line
    text: "Check your account", // plain text body
    html: `<p>Hi ${name} ${surname}, check your account in Drivers Manager</p>
            <p>Your account is ready, you just have to check it in the following link
              <a href="${process.env.FRONTEND_URL}/auth/confirm/${token}">Check Account</a>
            </p>
            <p>If you did not create this account, you can ignore this message.</p>
    `, // html body
  });

  // console.log("Message sent: %s", info.messageId);
};

export const emailForgetPassword = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, surname, token } = data;
  // Enviando email
  const info = await transporter.sendMail({
    from: '"Drivers Manager"', // sender address
    to: email, // list of receivers
    subject: "Reset your password", // Subject line
    text: "Reset your password", // plain text body
    html: `<p>Hi ${name} ${surname}, you have requested to reset your password</p>
            <p>Follow this link to generate a new password
              <a href="${process.env.FRONTEND_URL}/auth/forget-password/${token}">Reset Password</a>
            </p>
            <p>If you did not create this account, you can ignore this message.</p>
    `, // html body
  });
};
