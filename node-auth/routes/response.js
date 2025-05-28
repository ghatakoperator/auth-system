module.exports.sendSuccessResponse = (res, statusCode, data, errorData, message) => {
    res.status(statusCode).json({ statusCode: statusCode, success: true, data: data, error: errorData, message: message  });
};

module.exports.sendErrorResponse = (res, statusCode, data, errorData, message) => {
    res.status(statusCode).json({ statusCode: statusCode, success: false, data: data,error: errorData, message: message  });
};