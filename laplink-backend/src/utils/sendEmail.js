import nodemailer from "nodemailer";

const DEFAULT_FROM = "JeevanSetu <no-reply@jeevansetu.local>";

let transporter;
let lastSignature;

const getSmtpConfig = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  return {
    host: SMTP_HOST,
    port: SMTP_PORT ? Number(SMTP_PORT) : 587,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: SMTP_FROM || DEFAULT_FROM,
  };
};

const buildTransporter = async () => {
  const config = getSmtpConfig();
  const signature = JSON.stringify({
    host: config.host,
    port: config.port,
    user: config.user,
    pass: config.pass,
  });

  if (transporter && lastSignature === signature) {
    return transporter;
  }

  try {
    if (!config.host) {
      transporter = nodemailer.createTransport({ jsonTransport: true });
    } else {
      transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: config.user
          ? {
            user: config.user,
            pass: config.pass,
          }
          : undefined,
      });

      await transporter.verify();
    }

    lastSignature = signature;
    return transporter;
  } catch (err) {
    transporter = undefined;
    lastSignature = undefined;
    throw err;
  }
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    throw new Error("Recipient address is required to send email");
  }

  const activeTransporter = await buildTransporter();
  const { from } = getSmtpConfig();

  const info = await activeTransporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });

  if (activeTransporter.options.jsonTransport) {
    console.info("[Email simulated]", { to, subject, preview: info.message });
  }

  return info;
};

export const buildVerificationEmail = ({
  name,
  otp,
  expiresInMinutes = 10,
}) => {
  const safeName = name?.trim() ? name.trim() : "there";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(225,29,72,0.12), rgba(244,114,182,0.16)); border: 1px solid rgba(225,29,72,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #dc2626, #fb7185); color: #fff; font-weight: 700; font-size: 24px; letter-spacing: -0.02em;">
            JS
          </div>
          <h2 style="margin: 16px 0 4px; font-size: 24px; font-weight: 700;">Verify your JeevanSetu account</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7); font-size: 14px;">Namaste ${safeName},</p>
        </div>

        <p style="margin: 0 0 16px; line-height: 1.6;">Thank you for joining JeevanSetu. Please enter the OTP below to confirm your email and activate your dashboard access.</p>

        <div style="background: #fff; border-radius: 14px; border: 1px dashed rgba(225,29,72,0.35); padding: 20px; text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; font-size: 30px; font-weight: 700; letter-spacing: 8px; color: #dc2626;">${otp}</span>
        </div>

        <p style="margin: 0 0 12px; line-height: 1.6;">This OTP expires in ${expiresInMinutes} minutes. If you didn’t request this, you can safely ignore the message.</p>

        <p style="margin: 0; line-height: 1.6;">With gratitude,<br /><strong>The JeevanSetu Team</strong></p>
      </div>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(15,23,42,0.45); text-align: center;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  const text = `Namaste ${safeName},

Thank you for joining JeevanSetu. Your verification code is ${otp}.
It expires in ${expiresInMinutes} minutes.

If you did not request this, please ignore the email.

The JeevanSetu Team`;

  return { html, text };
};

export const buildPasswordResetEmail = ({
  name,
  otp,
  expiresInMinutes = 10,
}) => {
  const safeName = name?.trim() ? name.trim() : "there";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,165,233,0.16)); border: 1px solid rgba(59,130,246,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #2563eb, #0ea5e9); color: #fff; font-weight: 700; font-size: 24px; letter-spacing: -0.02em;">
            JS
          </div>
          <h2 style="margin: 16px 0 4px; font-size: 24px; font-weight: 700;">Reset your JeevanSetu password</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7); font-size: 14px;">Namaste ${safeName},</p>
        </div>

        <p style="margin: 0 0 16px; line-height: 1.6;">Enter the one-time password below to verify your identity and choose a new password. For security, the code expires in ${expiresInMinutes} minutes.</p>

        <div style="background: #fff; border-radius: 14px; border: 1px dashed rgba(59,130,246,0.35); padding: 20px; text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; font-size: 30px; font-weight: 700; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>

        <p style="margin: 0 0 12px; line-height: 1.6;">If you didn’t request a password reset, you can safely ignore this email.</p>
      </div>
      <p style="margin: 16px 0 0; font-size: 12px; color: rgba(15,23,42,0.45); text-align: center;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  const text = `Namaste ${safeName},

Use the following OTP to reset your JeevanSetu password (expires in ${expiresInMinutes} minutes): ${otp}

If you did not request this change, you can safely ignore this email.

The JeevanSetu Team`;

  return { html, text };
};

export const buildRequestPublishedEmail = ({
  name,
  patientName,
  bloodGroup,
  neededBy,
}) => {
  const safeName = name?.trim() ? name.trim() : "there";
  const dateStr = new Date(neededBy).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.16)); border: 1px solid rgba(99,102,241,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; font-weight: 700; font-size: 24px;">
            JS
          </div>
          <h2 style="margin: 16px 0 4px; font-size: 24px; font-weight: 700;">Request Published!</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7); font-size: 14px;">Namaste ${safeName},</p>
        </div>
        <p style="margin: 0 0 16px; line-height: 1.6;">Your request for <strong>${bloodGroup}</strong> blood/plasma for <strong>${patientName}</strong> has been successfully published.</p>
        <div style="background: #fff; border-radius: 14px; padding: 20px; text-align: left; margin-bottom: 20px; border: 1px solid rgba(99,102,241,0.1);">
          <p style="margin: 0 0 8px; font-size: 14px; color: #64748b;"><strong>Needed By:</strong> ${dateStr}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">We will notify you immediately once a donor matches your request.</p>
        </div>
        <p style="margin: 0; line-height: 1.6;">The JeevanSetu Team</p>
      </div>
    </div>
  `;

  return { html, text: `Your request for ${patientName} (${bloodGroup}) is live.` };
};

export const buildMatchNotificationRequester = ({
  name,
  donorName,
  donorPhone,
  patientName,
}) => {
  const safeName = name?.trim() || "User";
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(52,211,153,0.16)); border: 1px solid rgba(16,185,129,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 16px 0 4px; font-size: 24px; font-weight: 700; color: #059669;">Good News! 🎉</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7);">We found a donor for ${patientName}!</p>
        </div>
        <div style="background: #fff; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px;"><strong>Donor Name:</strong> ${donorName}</p>
          <p style="margin: 0;"><strong>Contact:</strong> ${donorPhone}</p>
        </div>
        <p style="margin: 0 0 16px;">Please contact the donor soon to coordinate the donation.</p>
        <p style="margin: 0;">The JeevanSetu Team</p>
      </div>
    </div>
  `;
  return { html, text: `Good News! We found a donor (${donorName}) for ${patientName}. Contact: ${donorPhone}` };
};

export const buildMatchNotificationDonor = ({
  name,
  patientName,
  hospital,
  contactPhone,
  bloodGroup,
}) => {
  const safeName = name?.trim() || "Donor";
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,165,233,0.16)); border: 1px solid rgba(59,130,246,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 16px 0 4px; font-size: 24px; font-weight: 700; color: #2563eb;">You matched a request!</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7);">Start saving a life today.</p>
        </div>
        <p style="margin: 0 0 16px;">You have been matched to donate <strong>${bloodGroup}</strong>.</p>
        <div style="background: #fff; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px;"><strong>Patient:</strong> ${patientName}</p>
          <p style="margin: 0 0 8px;"><strong>Hospital:</strong> ${hospital}</p>
          <p style="margin: 0;"><strong>Contact:</strong> ${contactPhone}</p>
        </div>
        <p style="margin: 0;">The JeevanSetu Team</p>
      </div>
    </div>
  `;
  return { html, text: `You matched a request for ${patientName}. Hospital: ${hospital}. Contact: ${contactPhone}` };
};

export const buildDonationCompletedEmail = ({ name, type, date }) => {
  // type = 'donor' or 'recipient'
  const isDonor = type === 'donor';
  const color = isDonor ? '#059669' : '#0ea5e9'; // Green or Blue
  const title = isDonor ? "Thank You for Donating!" : "Donation Received!";
  const msg = isDonor
    ? "Your generosity has saved a life today. We are incredibly proud of you."
    : "The donation has been marked as completed. We hope for a speedy recovery.";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; border: 1px solid ${color}; background: #f8fafc;">
        <h2 style="color: ${color}; text-align: center;">${title}</h2>
        <p style="line-height: 1.6; text-align: center;">${msg}</p>
        <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #64748b;">${new Date(date).toDateString()}</p>
      </div>
    </div>
  `;
  return { html, text: `${title} ${msg}` };
};

export const buildWelcomeEmail = ({ name }) => {
  const safeName = name?.trim() || "Member";
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <div style="padding: 24px; border-radius: 18px; background: linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.16)); border: 1px solid rgba(236,72,153,0.2);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 20px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; font-size: 30px; box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.2);">
            ✨
          </div>
          <h2 style="margin: 16px 0 4px; font-size: 26px; font-weight: 800; background: linear-gradient(to right, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Welcome to JeevanSetu!</h2>
          <p style="margin: 0; color: rgba(15,23,42,0.7); font-size: 16px;">Namaste ${safeName},</p>
        </div>
        
        <p style="margin: 0 0 16px; line-height: 1.6; font-size: 15px;">Your account has been <strong>successfully verified</strong>! You are now part of a community dedicated to saving lives.</p>
        
        <div style="background: white; border-radius: 14px; padding: 20px; border: 1px solid rgba(139,92,246,0.15); margin-bottom: 24px;">
          <h3 style="margin: 0 0 12px; font-size: 16px; color: #8b5cf6;">🚀 What you can do now:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.6;">
            <li style="margin-bottom: 8px;">Update your profile to keep your info current.</li>
            <li style="margin-bottom: 8px;">Log your donations to track your impact.</li>
            <li style="margin-bottom: 8px;">Explore requests if you are looking to help others.</li>
          </ul>
        </div>
        
        <p style="margin: 0 0 16px; line-height: 1.6;">We are thrilled to have you with us on this journey of kindness.</p>
        
        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.05);">
          <p style="margin: 0; font-size: 14px; color: #94a3b8;">The JeevanSetu Team</p>
        </div>
      </div>
    </div>
  `;
  return { html, text: `Welcome to JeevanSetu, ${safeName}! Your account is verified.` };
};

export default sendEmail;
