const { v4 : uuidv4} = require('uuid')
const {Session} = require("../models");
const { errorResponse } = require("../utils/responseGenerator");

const validateSession = async(req, res, next) => {
    try {
        const sessionId = req.cookies.session_id;
        if(!sessionId){
            return errorResponse(res, "Session not valid! Scan again", 401)
        }
        const sessionFromDb = await Session.findOne({ where: { session_id: sessionId } });

        if(!sessionFromDb || new Date() > new Date(sessionFromDb.expires_at)){
            return errorResponse(res, "Session not valid! Scan again", 401)
        }
       next()

    } catch (error) {
        return errorResponse(res, "Something went wrong", 500, { message:error.message, stack:error.stack })
    }
}

const createSession = async(req, res, next) => {
    try {
        const { tableId } = req.body;
        const newSessionId = uuidv4()
        res.cookie( 'session_id', newSessionId, { httpOnly: true, secure: true, maxAge: 30 * 60 * 1000 } )
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

        await Session.create({
            session_id: newSessionId,
            table_id: tableId,
            expires_at: expiresAt
        });
        next()
    } catch (error) {
        return errorResponse(res, errorData = { message:error.message, stack:error.stack} )
    }
}

const validateAndCreateSession = async (req, res, next) => {
    try {
        const { tableId } = req.body;
        if (!tableId) return errorResponse(res, "Table ID is required", 400);
        console.log("=========")
        console.log("req.cookies.session_id",req?.cookies?.session_id)
        const sessionId = req.cookies.session_id;
        if(!sessionId){
            //create session and next()
            return createSession(req, res, next)
        }
        //If session then validate it and if not valide create session and next()
        const sessionFromDb = await Session.findOne({ where: { session_id: sessionId } });

        if(!sessionFromDb || new Date() > new Date(sessionFromDb.expires_at)){
            return createSession(req, res, next)
        }
        next()
    } catch (error) {
        return errorResponse(res, errorData = { message:error.message, stack:error.stack} ) 
    }
}

module.exports = { validateSession, validateAndCreateSession }