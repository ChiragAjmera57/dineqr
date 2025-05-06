const twilioClient = require("../../config/twilio");
const { User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responseGenerator");
const {sendSMS} = require('../../services/smsService')
const { redisClient } = require("../../config/redisConfig");

const addPhNumber = async (req, res) => {
  try {
    const { userId, phNumber } = req.body;

    // Validate user
    const userFromDb = await User.findByPk(userId);
    if (!userFromDb) {
      return errorResponse(res, "User not found!", 404);
    }

    // Generate a 3-digit OTP
    const otp = Math.floor(100 + Math.random() * 900); // Generates a random 3-digit number

    // Send OTP via SMS
    const message = `Your OTP for phone number verification is: ${otp}`;
    const smsResponse = await sendSMS(`+91${phNumber}`, message);

    if (!smsResponse.success) {
      console.error("Failed to send SMS:", smsResponse.error);
      return errorResponse(res, "Failed to send OTP. Please try again.", 500);
    }

    // Store OTP in Redis with a 3-minute expiration
    const otpKey = `otp:${phNumber}`;
    await redisClient.set(otpKey, otp, "EX", 3 * 60); // 3 minutes expiration

    // Update phone number in the database
    await userFromDb.update({
      phNumber: phNumber,
    });

    return successResponse(res, null, "Phone number updated and OTP sent successfully.");
  } catch (error) {
    console.error("Error in addPhNumber:", error);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const verifyAndUpdatePhnumber = async (req,res) => {
  try {
    const {phNumber, userId, otp} = req.body
    const getOptFromStorage = await redisClient.get(`otp:${phNumber}`)
    if(!getOptFromStorage) return errorResponse(res,"No otp or expired",404)
    if(otp != getOptFromStorage) return errorResponse(res,"Invalid otp",401)
    const userFoundFromDb = await User.findByPk(userId)
    if(!userFoundFromDb) return errorResponse(res,"User not found!",404)
    await userFoundFromDb.update({
      phone_verified:true
    })
    await redisClient.del(`otp:${phNumber}`)
    return successResponse(res,null,"Otp validated")
  } catch (error) {
    console.error("Error in verifyAndUpdatePhnumber:", error);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }

}



module.exports = { addPhNumber, verifyAndUpdatePhnumber };