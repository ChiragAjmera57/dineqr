const { v4: uuidv4 } = require("uuid");
const { Session, DngTable, SessionFingerprint } = require("../models");
const { errorResponse, successResponse } = require("../utils/responseGenerator");
const { getAllMenu } = require("../controllers/menu.controller");
const { Op, Sequelize, where } = require("sequelize");
const cookieParser = require('cookie-parser');

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
    const fingerprintId = req.body?.fingerprintId || req.cookies?.fingerprintId;
    if(!fingerprintId){
      return errorResponse(res,"fingerprintid is require",400)
    }
    console.log(`Creating new session for table ${tableId}`);

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
      console.log("Existing session found for requested table", existingSession);
      if (existingSession?.users_involved.length != 0) {
        console.log("Table already occupied. Returnig user");
        return errorResponse(res, "Table already occupied. Ask to join the same or create a new table.", 400);
      }
    }

    const newSessionId = uuidv4();
    res.cookie("session_id", newSessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    console.log(`Created new session ID: ${newSessionId} for table ${tableId}`);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
    const rdmCustomerId = uuidv4()
    await Session.create({
      session_id: newSessionId,
      table_id: tableId,
      users_involved: [rdmCustomerId],
      expires_at: expiresAt,
    });
    await SessionFingerprint.create({
      fingerprint_id:fingerprintId,
      session_id:newSessionId
    })
    console.log(`Session created successfully for table ${tableId}`);
    if (next) {
      console.log("next")
      next();
      console.log("========")
    } else {
      console.log("returning from createsession function")
      return;
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
    const { tableId } = req.body;
    console.log(`Validating and creating session for table ${tableId}`);
    if (!tableId) return errorResponse(res, "Table ID is required", 400);
    const sessionId = req.cookies.session_id;
    const fingerprintId = req.body?.fingerprintId || req.cookies?.fingerprintId;

    if (sessionId) {
      console.log("Customer already has session ID in cookies:", sessionId);
      const sessionFromDb = await Session.findOne({
        where: { session_id: sessionId },
      });
      if (sessionFromDb) console.log("Session found for current user", sessionFromDb);
      if (!sessionFromDb || new Date() > new Date(sessionFromDb?.expires_at) || sessionFromDb?.table_id !== tableId) {
        console.log(`Currently sitting on ${sessionFromDb?.table_id} and wants to sit on ${tableId}`);
        if (req.cookies.session_id) {
          await clearPreviousSession(sessionFromDb, tableId, res);
        }
        return createSession(req, res, next);
      }
      console.log("Session is valid and matches the table ID. Sending menu");
      next();
    } else if (fingerprintId) {
      const sessionFound = await getSessionFromFingerprint(fingerprintId);
      if (sessionFound) {
        const sessionFromDb = await Session.findOne({
          where: { session_id: sessionFound },
        });
        if (sessionFromDb) console.log("Session found for current user", sessionFromDb);
        if (!sessionFromDb || new Date() > new Date(sessionFromDb?.expires_at) || sessionFromDb?.table_id !== tableId) {
          console.log(`Currently sitting on ${sessionFromDb?.table_id} and wants to sit on ${tableId}`);
          if (req.cookies.session_id) {
            await clearPreviousSession(sessionFromDb, tableId, res);
          }
          return createSession(req, res, next);
        }
        console.log("Session is valid and matches the table ID. Sending menu");
        next();
      } else {
        console.log("Customer doesn't have any session in cookies or fingerprint");
        return handleTableAvailability(tableId, req, res, next);
      }
    } else {
      console.log("Customer doesn't have any session in cookies");
      return handleTableAvailability(tableId, req, res, next);
    }
  } catch (error) {
    console.error("Error in validateAndCreateSession:", error);
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const clearPreviousSession = async (sessionFromDb, tableId, res) => {
  const existingSession = await Session.findOne({
    where: {
      table_id: tableId,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (existingSession) {
    console.log("Existing session found for requested table", existingSession);
    if (existingSession?.users_involved.length != 0) {
      console.log("Table already occupied. Returning user");
      throw new Error("Table already occupied. Ask to join the same or create a new table.");
    }
  }

  const updatedUsersInvolved = [...sessionFromDb.users_involved];
  console.log(`Before removing element: ${updatedUsersInvolved}`);
  if (updatedUsersInvolved.length > 0) {
    updatedUsersInvolved.pop();
  }
  console.log(`After removing element: ${updatedUsersInvolved}`);

  await sessionFromDb.update({
    users_involved: updatedUsersInvolved,
  });
  console.log("Clearing previous session and giving new session", updatedUsersInvolved);
  res.clearCookie("session_id");
};

const getSessionFromFingerprint = async (fingerprintId) => {
  const sessionFingerprintData = await SessionFingerprint.findOne({
    where: {
      fingerprint_id: fingerprintId,
    },
  });
  return sessionFingerprintData?.session_id;
};

const handleTableAvailability = async (tableId, req, res, next) => {
  console.log("Finding session for requested table", tableId);
  const sessionToThisTable = await Session.findOne({
    where: {
      table_id: tableId,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (sessionToThisTable && sessionToThisTable?.users_involved.length != 0) {
    console.log("Table already occupied.");
    console.log("Users involved in session:", sessionToThisTable?.users_involved);
    return errorResponse(
      res,
      "Table already occupied. Ask to join the same or create a new table.",
      400
    );
  } else {
    console.log("Table is free to sit");
    return createSession(req, res, next);
  }
};

const joinExistingTable = async (req, res) => {
  try {
    const { tableId } = req.body;
    if (!tableId) {
      return errorResponse(res, "Please provide tableId", 400);
    }
    const sessionId = req?.cookies?.session_id;
    if(sessionId){
      console.log("customer already have sessionid in cookies",sessionId)
      const sessionFromDb = await Session.findOne({
        where: { session_id: sessionId },
      });
      console.log("removing you from previous table...")
      const updatedUsersInvolved = [...sessionFromDb.users_involved]; // Create a copy of the array
      console.log(`Before removing element: ${updatedUsersInvolved}`);
      if(updatedUsersInvolved.length>0){
        updatedUsersInvolved.pop(); // Remove the last element
      }

      console.log(`After removing element: ${updatedUsersInvolved}`);

      console.log("removed you from previous table",updatedUsersInvolved)
      if(updatedUsersInvolved.length == 0){
        console.log("No one on you previous table. Expiring its session...")
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved,
          expires_at: new Date()
        });   
        console.log("After updating you last session",sessionFromDb)                
      }
      else{
        console.log("Info: Someone is still siting on you previous table")
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved
        });
      }
      
      res.clearCookie('session_id')
      console.log("cleared previous session from cookie")
    }
    const sessionToThisTable = await Session.findOne({
      where: {
        table_id: tableId,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });
    console.log("Adding you to you requested table...")
    if (!sessionToThisTable) {
      console.log("No one sitting on requested table adding you")
      await createSession(req, res);
      return successResponse(res,data=null,"created session go to /menu manually")
      // return res.redirect(`/menu/?tableId=${tableId}`);
    } else {
      console.log("Adding you to requested table with your friend...")
      const rdmCustomerId = uuidv4()
      await sessionToThisTable.update({
        users_involved: Sequelize.fn('array_append', Sequelize.col('users_involved'), rdmCustomerId)
      });    
      console.log("setting cookies and updating user on table") 
       res.cookie("session_id", sessionToThisTable.session_id, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 60 * 1000,
      });
      // return res.redirect(`/menu/?tableId=${tableId}`); // Redirect to the menu page
      return successResponse(res,data=null,"joined existing table ")
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
      console.log("joinNewTable")
      const tempTableName = uuidv4().split('-').slice(0, 5).join('-');
      const sessionId = req?.cookies?.session_id;
      if(sessionId){
        res.clearCookie('session_id')
      }
      // Create a new table
      const newTable = await DngTable.create({ name: tempTableName });
      
      // Create a new session for the new table
      req.body.tableId = newTable.id;
      await createSession(req, res);
      
      // return res.redirect(`/menu/?tableId=${newTable.id}`); // Redirect to the menu page
      return successResponse(res,data=null,"joined new table")
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, {
        message: error.message,
        stack: error.stack,
      });
    }
  };


module.exports = { validateSession, validateAndCreateSession, joinExistingTable, joinNewTable };