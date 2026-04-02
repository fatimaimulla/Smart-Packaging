import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
};

export const sendOtpEmail = async ({ email, otp, name }) => {
  const client = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await client.sendMail({
    from,
    to: email,
    subject: "Your SmartPack verification code",
    text: `Hello ${name || "there"}, your SmartPack verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Hello ${name || "there"},</p><p>Your SmartPack verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
};
