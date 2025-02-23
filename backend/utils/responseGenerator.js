const successResponse = (res, data, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        error: null
    });
};

const errorResponse = (res, errorMessage = "Something went wrong", statusCode = 500, errorData = null) => {
    return res.status(statusCode).json({
        success: false,
        message: errorMessage,
        data: null,
        error: errorData
    });
};

module.exports = { successResponse, errorResponse };