import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === "465",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 10000,
});

export const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log("📬 SMTP ready: ", process.env.SMTP_HOST, process.env.SMTP_USER);
  } catch (err) {
    console.error("❌ SMTP verify failed:", err?.message || err);
  }
};

export const sendOTP = async (email, otp, purpose = "Verification") => {
    const mailOptions = {
        from: `"Gajanan-Computers Support" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: `Gajanan-Computers - ${purpose} OTP`,
        text: `Your OTP for ${purpose} is ${otp}. It expires in 10 minutes.`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6d28d9;">Gajanan-Computers Security</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for <strong>${purpose}</strong> is:</p>
        <h1 style="letter-spacing: 5px; color: #2563eb;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: `"Gajanan-Computers Team" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "Welcome to Gajanan-Computers!",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6d28d9;">Welcome to Gajanan-Computers, ${name}!</h2>
        <p>We are excited to have you on board.</p>
        <p>At Gajanan-Computers, you can:</p>
        <ul>
          <li>Request laptop repairs</li>
          <li>Sell your old devices</li>
          <li>Find verified used laptops</li>
        </ul>
        <p>If you need any help, just reply to this email.</p>
        <br/>
        <p>Best Regards,<br/>Gajanan-Computers Team</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, otp) => {
    await sendOTP(email, otp, "Password Reset");
};

export const notifyAdminNewRequest = async (type, data) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) return;

  const subject = `Gajanan-Computers: New ${type} Request`;
  const detailsHtml = Object.entries(data || {})
    .map(([k, v]) => `<li><strong>${k}</strong>: ${Array.isArray(v) ? v.join(', ') : v}</li>`)
    .join("");

  const mailOptions = {
    from: `Gajanan-Computers Notifications <${process.env.SMTP_FROM}>`,
    to: adminEmail,
    subject,
    html: `
    <div style="font-family:Arial,sans-serif;padding:20px;color:#111;background:#0b1020;border-radius:12px;border:1px solid #1e2a4a;">
      <h2 style="color:#7c3aed;">New ${type} Request</h2>
      <ul style="color:#d1d5db;">${detailsHtml}</ul>
      <p style="color:#9ca3af;">Login to Admin Panel to manage.</p>
      <p style="margin-top:12px"><a href="${process.env.APP_BASE_URL || 'http://localhost:5173'}/admin" style="color:#60a5fa;text-decoration:none">Open Admin Panel</a></p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
