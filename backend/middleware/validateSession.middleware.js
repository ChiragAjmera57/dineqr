const { v4: uuidv4 } = require("uuid");
const { Session, DngTable, SessionUser, User } = require("../models");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseGenerator");
const { getAllMenu } = require("../controllers/menu.controller");
const { Op, Sequelize, where } = require("sequelize");
const cookieParser = require("cookie-parser");

const validateSession = async (req, res, next) => {
  try {
    const sessionId = req.cookies.session_id;
    if (!sessionId) {
      return errorResponse(res, "Session not valid! Scan again", 401);
    }
    const sessionFromDb = await Session.findOne({
      where: { session_id: sessionId },
    });

    if (!sessionFromDb || new Date() > new Date(sessionFromDb.expires_at)) {
      return errorResponse(res, "Session not valid! Scan again", 401);
    }
    next();
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const createSession = async (req, res, next) => {
  try {
    const { tableId } = req.body;
    console.log(`Creating new session for table ${tableId}`);

    // Check if there is an existing valid session for the table
    const existingSession = await Session.findOne({ where: { table_id: tableId } });

    if (existingSession) {
      console.log("existing session found for table",tableId)
      const existingSessionUser = await SessionUser.findOne({
        where: { session_id: existingSession.id },
      });

      if (existingSessionUser) {
        console.log("Session already exists for this table.");
        //join same or create new
        return successResponse(res, null, "Session already exists.");
      } else {
        console.log("No users in the existing session.deleting that unused session and Recreating new session, user, sessionUser...");
        await existingSession.destroy();
      }
    }

    const newSession = await Session.create({
      table_id: tableId,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
    });

    const newUser = await User.create({
      name: "dummy"
    })
    const newSessionUser = await SessionUser.create({
      session_id: newSession.id,
      user_id: newUser.id
    });

    console.log("New session created successfully.");
    console.log("setting cookies in you frontend...",newSession.id)
    res.cookie("session_id", newSession.id, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    req.session_id = newSession.id
    req.user_id = newUser.id
    if (next) {
      console.log("next");
      return next();
      } else {
      console.log("returning from createSession function");
      return newUser.id;
      }
  } catch (error) {
    console.error("Error in createSession:", error);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const validateAndCreateSession = async (req, res, next) => {
  try {
    console.log("=====validation starts======");
    const { tableId, user_id } = req.body;
    if (!tableId) return errorResponse(res, "Table ID is required", 400);

    let sessionId = req.cookies.session_id;

    if (!sessionId && user_id) {
      console.log("No session ID in cookies. Searching session by user ID...");
      const sessionUser = await SessionUser.findOne({
        where: { user_id },
      });
      if (sessionUser) {
        sessionId = sessionUser.session_id;
        console.log("Found session ID using user ID:", sessionId);

        const sessionFromDb = await Session.findOne({
          where: {
            id: sessionId,
            expires_at: { [Op.gt]: new Date() },
          },
        });

        if (!sessionFromDb) {
          console.log("Session found using user ID is invalid or expired.");
          sessionId = null; // Reset sessionId if it's not valid
        } else {
          console.log("Session found using user ID is valid.");
          res.cookie("session_id", sessionFromDb.id, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
          });
        }
      } else {
        console.log("No session found for the provided user ID.");
      }
    }

    if (sessionId) {
      console.log("Session ID found:", sessionId);
      const sessionFromDb = await Session.findOne({
        where: {
          id: sessionId,
          expires_at: { [Op.gt]: new Date() },
        },
      });

      if (sessionFromDb) {
        console.log("Session from cookies or user ID is valid.");
        if (tableId === sessionFromDb.table_id) {
          console.log("User is already in the session for this table. Returning menu.");
          return next();
        } else {
          console.log("User is switching tables. Cleaning up previous session...");
          if (!user_id) return errorResponse(res, "User ID is required", 400);

          await SessionUser.destroy({
            where: { user_id, session_id: sessionId },
          });

          const remainingUsers = await SessionUser.findOne({
            where: { session_id: sessionId },
          });
          if (!remainingUsers) console.log("No one left on your previous table. Clearing session...");
          if (!remainingUsers) {
            await sessionFromDb.destroy();
          }
          console.log("Clearing session cookies from frontend...");
          res.clearCookie("session_id");
        }
      } else {
        console.log("Session is invalid or expired. Clearing cookies...");
        res.clearCookie("session_id");
      }
    } else {
      console.log("No session ID or user ID provided. Assuming user does not have a session.");
    }

    console.log("Creating a new session...");
    await createSession(req, res, next);
  } catch (error) {
    console.error("Error in validateAndCreateSession:", error);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const joinExistingTable = async (req, res) => {
  try {
    const { tableId, user_id } = req.body;
    if (!tableId) return errorResponse(res, "Table ID is required", 400);

    let sessionId = req.cookies.session_id;

    if (!sessionId && user_id) {
      console.log("No session ID in cookies. Searching session by user ID...");
      const sessionUser = await SessionUser.findOne({
        where: { user_id },
      });
      if (sessionUser) {
        sessionId = sessionUser.session_id;
        console.log("Found session ID using user ID:", sessionId);

        const sessionFromDb = await Session.findOne({
          where: {
            id: sessionId,
            expires_at: { [Op.gt]: new Date() },
          },
        });

        if (!sessionFromDb) {
          console.log("Session found using user ID is invalid or expired.");
          sessionId = null; // Reset sessionId if it's not valid
        } else {
          console.log("Session found using user ID is valid.");
          res.cookie("session_id", sessionFromDb.id, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
          });
        }
      } else {
        console.log("No session found for the provided user ID.");
      }
    }

    if (sessionId) {
      console.log("Session ID found:", sessionId);
      const OlderSession = await Session.findOne({
        where: {
          id: sessionId,
          expires_at: { [Op.gt]: new Date() },
        },
      });
      if (!user_id) return errorResponse(res, "User ID is required", 400);

      await SessionUser.destroy({
        where: { user_id, session_id: sessionId },
      });

      const remainingUsers = await SessionUser.findOne({
        where: { session_id: sessionId },
      });
      if (!remainingUsers) console.log("No one left on your previous table. Clearing session...");
      if (!remainingUsers) {
        await OlderSession.destroy();
      }
      console.log("Clearing session cookies from frontend...");
      res.clearCookie("session_id");
    }
    let SessionForReqTable = await Session.findOne({
      where: {
      table_id: tableId,
      },
    });
    if (!SessionForReqTable) {
      SessionForReqTable = await Session.create({
      table_id: tableId,
      expires_at: new Date(Date.now() + 15 * 60 * 1000),
      });
    }
    const newSessionUser = await SessionUser.create({
      session_id: SessionForReqTable.id,
      user_id: user_id,
    });
    res.cookie("session_id", SessionForReqTable.id, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    return successResponse(res,{user_id:user_id,redirectUrl:`http://192.168.1.13:3000/menu${tableId}`},"joined existing table")
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const joinNewTable = async (req, res) => {
  try {
    const { tableId, user_id } = req.body;
    if (!tableId) return errorResponse(res, "Table ID is required", 400);

    let sessionId = req.cookies.session_id;

    if (!sessionId && user_id) {
      console.log("No session ID in cookies. Searching session by user ID...");
      const sessionUser = await SessionUser.findOne({
        where: { user_id },
      });
      if (sessionUser) {
        sessionId = sessionUser.session_id;
        console.log("Found session ID using user ID:", sessionId);

        const sessionFromDb = await Session.findOne({
          where: {
            id: sessionId,
            expires_at: { [Op.gt]: new Date() },
          },
        });

        if (!sessionFromDb) {
          console.log("Session found using user ID is invalid or expired.");
          sessionId = null; // Reset sessionId if it's not valid
        } else {
          console.log("Session found using user ID is valid.");
          res.cookie("session_id", sessionFromDb.id, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
          });
        }
      } else {
        console.log("No session found for the provided user ID.");
      }
    }

    if (sessionId) {
      console.log("Session ID found:", sessionId);
      const OlderSession = await Session.findOne({
        where: {
          id: sessionId,
          expires_at: { [Op.gt]: new Date() },
        },
      });
      if (!user_id) return errorResponse(res, "User ID is required", 400);

      await SessionUser.destroy({
        where: { user_id, session_id: sessionId },
      });

      const remainingUsers = await SessionUser.findOne({
        where: { session_id: sessionId },
      });
      if (!remainingUsers) console.log("No one left on your previous table. Clearing session...");
      if (!remainingUsers) {
        await OlderSession.destroy();
      }
      console.log("Clearing session cookies from frontend...");
      res.clearCookie("session_id");
    }
    const foundTable = await DngTable.findByPk(tableId);
    if (!foundTable) {
      return errorResponse(res, "Something went wrong", 500, {
        message: "No table found!",
      });
    }
    console.log("found table", foundTable);
    const adminId = foundTable.admin_id;
    // Create a new table
    const tempTableName = uuidv4().split('-').slice(0, 5).join('-');
    const newTable = await DngTable.create({
      name: tempTableName,
      admin_id: adminId,
    });

    // Create a new session for the new table
    req.body.tableId = newTable.id;
    const newUserId = await createSession(req, res);
    return successResponse(
      res,
      (data = {user_id:newUserId, redirectUrl: `http://192.168.1.13:3000/menu/${newTable.id}` }),
      "joined new table"
    );
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  validateSession,
  validateAndCreateSession,
  joinExistingTable,
  joinNewTable,
};
