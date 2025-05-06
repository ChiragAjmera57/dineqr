const { Session, DngTable, SessionUser } = require("../models");
const { Op, Sequelize, where } = require("sequelize");
const { errorResponse, successResponse } = require("../utils/responseGenerator");

const getTableStatus = async (req, res) => {
  try {
    const { admin_id } = req;

    // Get all sessions that are not expired and belong to tables associated with the admin_id
    const activeSessions = await Session.findAll({
      where: {
      expires_at: {
        [Op.gt]: new Date(),
      },
      },
      include: [
      {
        model: DngTable,
        as: 'table',
        where: {
        admin_id: admin_id,
        },
      },
      {
        model: SessionUser,
        as: 'sessionUsers', 
      },
      ],
    });

    // Get all tables that belong to the admin_id
    const allTables = await DngTable.findAll({
      where: {
        admin_id: admin_id,
      },
    });

    const activeTableIds = activeSessions.map(session => session.table_id);

    const vacantTables = allTables.filter(table => !activeTableIds.includes(table.id));

    return successResponse(res, {
      activeSessions,
      vacantTables
    }, "Table status fetched successfully");
  } catch (error) {
    return errorResponse(res, "Something went wrong", 500, {
      message: error.message,
      stack: error.stack,
    });
  }
};

const expireSession = async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return errorResponse(res, "Session ID is required", 400);
      }
      await SessionUser.destroy({
        where: {
          session_id: sessionId
        }
      });
      const session = await Session.findByPk(sessionId);
      if (!session) {
        return errorResponse(res, "Session not found", 404);
      }
  
      session.expires_at = new Date(); // Set the expiration time to now
      await session.save();
  
      return successResponse(res, session, "Session expired successfully", 200);
    } catch (error) {
      return errorResponse(res, "Something went wrong", 500, {
        message: error.message,
        stack: error.stack,
      });
    }
  };

module.exports = { getTableStatus, expireSession };