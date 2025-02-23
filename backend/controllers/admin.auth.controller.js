const {Admin} = require("../models");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseGenerator");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const access_token_key = process.env.ACCESS_TOKEN_SECRET_KEY;
const refresh_token_key = process.env.REFRESH_TOKEN_SECRET_KEY;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "All fields are required", 400);
    }
    // Check if the user exists
    const user = await Admin.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    // Check if the password is correct
    bcrypt.compare(password,user.password,(err,result)=>{
        if(err){
            return errorResponse(res,"Invalid password",401,{err})
        }
        const jwt_payload = {
            "sub": newUser.id,
            "username": user.org_name,
            "role": "admin",
            "iat": Math.floor(Date.now() / 1000), 
          }
        const jwt_token = jwt.sign(jwt_payload, access_token_key, {
            expiresIn: "15m",
          });
        
        const jwt_refresh_token = jwt.sign(jwt_payload, refresh_token_key, {
            expiresIn: "7d",
          });
          return successResponse(res,{jwt_token,jwt_refresh_token},"Login succesful",200)
    })

  } catch (error) {}
};

const signup = async (req, res) => {
  try {
    const { email, password, org_name } = req.body;
    if (!email || !password || !org_name) {
      return errorResponse(res, "All fields are required", 400);
    }
    const user = await Admin.findOne({ where: { email } });
    if (user) {
      return errorResponse(res, "Email already registered", 409);
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return errorResponse(res, "Something went wrong", 500, {err});
      }
      try {
          const newUser = await Admin.create({ email, password: hash, org_name });
          console.log("newUser",newUser)
          const jwt_payload = {
              "sub": newUser.id,
              "username": newUser?.org_name,
              "role": "admin",
              "iat": Math.floor(Date.now() / 1000), 
            }
            console.log("access_token_key",access_token_key)
            try {
              const jwt_token = jwt.sign(jwt_payload, access_token_key, {
                  expiresIn: "15m",
              });
              const jwt_refresh_token = jwt.sign(jwt_payload, refresh_token_key, {
                  expiresIn: "7d",
              });
              return successResponse(res, { jwt_token, jwt_refresh_token }, "User register succesfully",201);
            } catch (jwtError) {
              await newUser.destroy();
              return errorResponse(res, "Unable to create JWT token", 500, {jwtError});
            }
      } catch (error) {
        return errorResponse(res, "Unable to create user", 500, {error});
      }
    });
  } catch (error) {
    return errorResponse(res,"Something went wrong",500,{error})
  }
};
module.exports = {
  login,
  signup
};
