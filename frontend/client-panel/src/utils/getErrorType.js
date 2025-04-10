const getErrorType = (error) => {
  const message = error?.error?.message || error?.message || '';

  console.log("ERROR IN GETERRORFUNCTION:", message);

  switch (message) {
    case 'Failed to create session':
      return 'sequelize';
    case 'Session not found. Please scan the QR code again.':
      return 'sessionExpired';
    case 'Table already occupied. Ask to join the same or create a new table.':
      return 'tableOccupied';
    case 'Table not found':
      return 'sessionExpired';
    default:
      return 'unknown';
  }
};

export default getErrorType;
