const { v4: uuidv4 } = require("uuid");
const { Session } = require("../models");
const { errorResponse } = require("../utils/responseGenerator");
const { getAllMenu } = require("../controllers/menu.controller");
const { Op } = require("sequelize");

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

    // Check if there is an existing valid session for the table
    const existingSession = await Session.findOne({
      where: {
        table_id: tableId,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (existingSession) {
      return errorResponse(res, "Table already occupied. Ask to join the same or create a new table.", 400);
    }

    const newSessionId = uuidv4();
    res.cookie("session_id", newSessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
    });
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

    await Session.create({
      session_id: newSessionId,
      table_id: tableId,
      expires_at: expiresAt,
    });
    if (next) {
      next();
    }
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const validateAndCreateSession = async (req, res, next) => {
  try {
    const { tableId } = req.body;
    if (!tableId) return errorResponse(res, "Table ID is required", 400);
    const sessionId = req.cookies.session_id;
    if (sessionId) {
      const sessionFromDb = await Session.findOne({
        where: { session_id: sessionId },
      });

      if (!sessionFromDb || new Date() > new Date(sessionFromDb.expires_at)) {
        await createSession(req, res, next);
        return;
      }
      next();
    } else {
      const sessionToThisTable = await Session.findOne({
        where: {
          table_id: tableId,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },
      });
      if (sessionToThisTable) {
        //session to that table already exist
        return errorResponse(
          res,
          "table already occupied ask to join same or create new table",
          400
        );
        //hit joint table function from frontend if customer want to join same table
      } else {
        //table is free to sit
        await createSession(req, res, next);
        return;
      }
    }
    console.log("=========");
  } catch (error) {
    return errorResponse(
      res,
      (errorData = { message: error.message, stack: error.stack })
    );
  }
};

const joinExistingTable = async (req, res) => {
  try {
    const { tableId } = req.body;
    if (!tableId) {
      return errorResponse(res, "Please provide tableId", 400);
    }
    const sessionToThisTable = await Session.findOne({
      where: {
        table_id: tableId,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });
    if (!sessionToThisTable) {
      await createSession(req, res);
      return res.redirect(`/menu/?tableId=${tableId}`);
    } else {
      res.cookie("session_id", sessionToThisTable.session_id, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 60 * 1000,
      });
      return res.redirect(`/menu/?tableId=${tableId}`); // Redirect to the menu page
    }
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const joinNewTable = async (req, res) => {
    try {
      const tempTableName = uuidv4().split('-').slice(0, 5).join('-');
  
      // Create a new table
      const newTable = await DngTable.create({ name: tempTableName });
  
      // Create a new session for the new table
      req.body.tableId = newTable.id;
      await createSession(req, res);
  
      return res.redirect(`/menu/?tableId=${newTable.id}`); // Redirect to the menu page
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, {
        message: error.message,
        stack: error.stack,
      });
    }
  };


module.exports = { validateSession, validateAndCreateSession, joinExistingTable, joinNewTable };