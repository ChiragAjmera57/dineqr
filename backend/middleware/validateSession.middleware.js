const { v4: uuidv4 } = require("uuid");
const { Session, DngTable, SessionUser } = require("../models");
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
    const existingSession = await Session.findOne({
      where: {
        table_id: tableId,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (existingSession) {
      console.log(
        "Existing session found for requested table",
        existingSession
      );
      if (existingSession?.users_involved.length != 0) {
        console.log("Table already occupied. Returnig user");
        return errorResponse(
          res,
          "Table already occupied. Ask to join the same or create a new table.",
          400
        );
      }
    }

    const newSessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
    const rdmCustomerId = uuidv4();

    try {
      const newSession = await Session.create({
        session_id: newSessionId,
        table_id: tableId,
        users_involved: [rdmCustomerId],
        expires_at: expiresAt,
      });

      if (newSession) {
        res.cookie("session_id", newSessionId, {
          httpOnly: true,
          // secure: true, // Required for SameSite=None
          // sameSite: "None", // Cross-site requests need this
          // path: "/", // Make cookie available for the whole domain
          maxAge: 15 * 60 * 1000,
        });
        console.log(
          `Created new session ID: ${newSessionId} for table ${tableId}`
        );
      } else {
        console.error("Failed to create session in the database.");
        return errorResponse(res, "Failed to create session", 500);
      }

      console.log(`Session created successfully for table ${tableId}`);
      req.session = newSession; // Set the session in the request object
      if (next) {
        console.log("next");
        next();
        console.log("========");
      } else {
        console.log("returning from createSession function");
        return;
      }
    } catch (error) {
      console.error("Error while creating session:", error);
      return errorResponse(res, "Failed to create session", 500, {
        message: error.message,
        stack: error.stack,
      });
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
    if (!tableId) return errorResponse(res, "Table ID is required", 400);
    const sessionId = req.cookies.session_id;
    if (sessionId) {
      const sessionFromDb = await Session.findOne({
        where: {
          id: sessionId,
          expires_at: {
            [Op.gt]: new Date(),
          },
        },
      });
      if (sessionFromDb) {
        if (tableId == sessionFromDb?.table_id) {
          return createSession(req, res, next);
        } else if (sessionFromDb?.table_id != tableId) {
          const { user_id } = req.body;
          if (!user_id) {
            return errorResponse(res, "user id is needed!", 400);
          }
          await SessionUser.destroy({
            where: {
              user_id,
              session_id: sessionId,
            },
          });
          const sessionUser = SessionUser.findOne({
            where: {
              session_id: sessionId,
            },
          });
          if (!sessionUser) {
            await sessionFromDb.destroy();
          }

          const findSessionForTable = await Session.findOne({
            where: {
              table_id: tableId,
            },
          });
          if (!findSessionForTable) {
            const sessionEntry = Session.create({
              table_id: tableId,
              expires_at: new Date(Date.now() + 15 * 60 * 1000),
            });
            const userEntry = User.create({
              name: "dummy",
            });
            const sessionUserEntry = sessionUser.create({
              session_id: sessionEntry.id,
              user_id: userEntry.id,
            });
          } else {
            const sessionUserEntryForCurrSession = await SessionUser.findOne({
              session_id: findSessionForTable.id,
            });
            if (sessionUserEntryForCurrSession) {
              //need to ask user whether to join same table or create new
            } else {
              await findSessionForTable.destroy();
              const sessionEntry2 = Session.create({
                table_id: tableId,
                expires_at: new Date(Date.now() + 15 * 60 * 1000),
              });
              const userEntry2 = User.create({
                name: "dummy",
              });
              const sessionUserEntry2 = sessionUser.create({
                session_id: sessionEntry2.id,
                user_id: userEntry2.id,
              });
            }
          }
        }
      } 
    }
    else {
      const findSessionForTable = await Session.findOne({
        where: {
          table_id: tableId,
        },
      });
      if (!findSessionForTable) {
        const sessionEntry = Session.create({
          table_id: tableId,
          expires_at: new Date(Date.now() + 15 * 60 * 1000),
        });
        const userEntry = User.create({
          name: "dummy",
        });
        const sessionUserEntry = sessionUser.create({
          session_id: sessionEntry.id,
          user_id: userEntry.id,
        });
      } else {
        const sessionUserEntryForCurrSession = await SessionUser.findOne({
          session_id: findSessionForTable.id,
        });
        if (sessionUserEntryForCurrSession) {
          //need to ask user whether to join same table or create new
        } else {
          await findSessionForTable.destroy();
          const sessionEntry2 = Session.create({
            table_id: tableId,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
          });
          const userEntry2 = User.create({
            name: "dummy",
          });
          const sessionUserEntry2 = sessionUser.create({
            session_id: sessionEntry2.id,
            user_id: userEntry2.id,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in validateAndCreateSession:", error);
    return errorResponse(res, { message: error.message, stack: error.stack });
  }
};

const joinExistingTable = async (req, res) => {
  try {
    const { tableId } = req.body;
    if (!tableId) {
      return errorResponse(res, "Please provide tableId", 400);
    }
    const sessionId = req?.cookies?.session_id;
    if (sessionId) {
      console.log("customer already have sessionid in cookies", sessionId);
      const sessionFromDb = await Session.findOne({
        where: { session_id: sessionId },
      });
      if (!sessionFromDb) {
        console.log(
          "Session ID not found in the database. Clearing client session from its browser..."
        );
        res.clearCookie("session_id");
        return errorResponse(res, "Session not found. Please try again.", 404);
      }
      console.log("Removing you from previous table...");
      const updatedUsersInvolved = [...sessionFromDb.users_involved]; // Create a copy of the array
      console.log(`Before removing element: ${updatedUsersInvolved}`);
      if (updatedUsersInvolved.length > 0) {
        updatedUsersInvolved.pop(); // Remove the last element
      }

      console.log(`After removing element: ${updatedUsersInvolved}`);

      console.log("removed you from previous table", updatedUsersInvolved);
      if (updatedUsersInvolved.length == 0) {
        console.log("No one on you previous table. Expiring its session...");
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved,
          expires_at: new Date(),
        });
        console.log("After updating you last session", sessionFromDb);
      } else {
        console.log("Info: Someone is still siting on you previous table");
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved,
        });
      }
      console.log("clearing client session from its browser....");
      res.clearCookie("session_id");
      console.log("cleared previous session from cookie");
    }
    const sessionToThisTable = await Session.findOne({
      where: {
        table_id: tableId,
        expires_at: {
          [Op.gt]: new Date(),
        },
      },
    });
    console.log("Adding you to you requested table...");
    if (!sessionToThisTable) {
      console.log("No one sitting on requested table adding you");
      await createSession(req, res);
      return successResponse(
        res,
        (data = { redirectUrl: `http://192.168.1.13:3000/menu/${tableId}` }),
        "created session go to /menu manually"
      );
    } else {
      console.log("Adding you to requested table with your friend...");
      const rdmCustomerId = uuidv4();
      await sessionToThisTable.update({
        users_involved: Sequelize.fn(
          "array_append",
          Sequelize.col("users_involved"),
          rdmCustomerId
        ),
      });
      console.log("setting cookies and updating user on table");
      res.cookie("session_id", sessionToThisTable.session_id, {
        httpOnly: true,
        // secure: true,
        // sameSite: "None",
        // path: "/",
        maxAge: 15 * 60 * 1000,
      });
      return successResponse(
        res,
        (data = { redirectUrl: `http://192.168.1.13:3000/menu/${tableId}` }),
        "joined existing table "
      );
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
    const { tableId } = req.body;
    if (!tableId) {
      return errorResponse(res, "Please provide tableId", 400);
    }
    console.log("joinNewTable", tableId);
    const tempTableName = uuidv4().split("-").slice(0, 5).join("-");
    const sessionId = req?.cookies?.session_id;
    if (sessionId) {
      console.log("customer already have sessionid in cookies", sessionId);
      const sessionFromDb = await Session.findOne({
        where: { session_id: sessionId },
      });

      if (!sessionFromDb) {
        console.log(
          "Session ID not found in the database. Clearing client session from its browser..."
        );
        res.clearCookie("session_id");
        return errorResponse(res, "Session not found. Please try again.", 404);
      }
      console.log("removing you from previous table...");
      const updatedUsersInvolved = [...sessionFromDb?.users_involved]; // Create a copy of the array
      console.log(`Before removing element: ${updatedUsersInvolved}`);
      if (updatedUsersInvolved.length > 0) {
        updatedUsersInvolved.pop(); // Remove the last element
      }

      console.log(`After removing element: ${updatedUsersInvolved}`);

      console.log("removed you from previous table", updatedUsersInvolved);
      if (updatedUsersInvolved.length == 0) {
        console.log("No one on you previous table. Expiring its session...");
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved,
          expires_at: new Date(),
        });
        console.log("After updating you last session", sessionFromDb);
      } else {
        console.log("Info: Someone is still siting on you previous table");
        await sessionFromDb.update({
          users_involved: updatedUsersInvolved,
        });
      }
      console.log("clearing client session from its browser....");
      res.clearCookie("session_id");
      console.log("cleared previous session from cookie");
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
    const newTable = await DngTable.create({
      name: tempTableName,
      admin_id: adminId,
    });

    // Create a new session for the new table
    req.body.tableId = newTable.id;
    await createSession(req, res);
    return successResponse(
      res,
      (data = { redirectUrl: `http://192.168.1.13:3000/menu/${newTable.id}` }),
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
