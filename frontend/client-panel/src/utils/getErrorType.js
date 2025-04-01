const getErrorType = (error) => {
    if (error?.message === 'Failed to create session') {
      return 'sequelize';
    }
    if (error?.message === 'Session not found. Please scan the QR code again.') {
      return 'sessionExpired';
    }
    if (error?.message === 'Table already occupied. Ask to join the same or create a new table.') {
      return 'tableOccupied';
    }
    return 'unknown';
  };

export default getErrorType