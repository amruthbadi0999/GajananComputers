import dotenv from "dotenv";
dotenv.config();

export async function sendSMS(to, body) {
  const provider = process.env.SMS_PROVIDER; // 'twilio'
  if (!provider) throw new Error('SMS provider not configured');

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) throw new Error('Twilio env missing');
    const twilio = await import('twilio');
    const client = twilio.default(sid, token);
    await client.messages.create({ from, to, body });
    return true;
  }

  throw new Error('Unsupported SMS provider');
}
