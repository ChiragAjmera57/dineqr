const getErrorType = (error) => {
  const message = error?.error?.message || error?.message || '';

  console.log("ERROR IN GETERRORFUNCTION:", message);

  switch (message) {
    case 'Failed to create session':
      return 'sequelize';
    case 'Session not found. Please scan the QR code again.':
      return 'sessionExpired';
    case 'Session already exists. Either join existing Table or join a new Table':
      return 'tableOccupied';
    case 'Table not found':
      return 'sessionExpired';
    default:
      return 'unknown';
  }
};

export default getErrorType;
