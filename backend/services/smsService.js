// services/smsService.js
const twilio = require('twilio');
const { accountSid, authToken, fromPhone } = require('../config/twilio');

const client = new twilio(accountSid, authToken);

async function sendSMS(toPhone, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone
    });
    console.log('SMS sent:', result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSMS };
