var express = require('express');
var router = express.Router();
const { sendSuccessResponse, sendErrorResponse } = require('./response');




/* GET home page. */
router.get('/', function (req, res, next) {
    res.send(JSON.stringify(req.headers));
});


/* GET success response . */
router.get('/success', async function (req, res, next) {
    const successResponse = [{ data: 'successfully' }];
    sendSuccessResponse(res, 200, successResponse, null, 'success message'); //pass parameter as response object, status code, API Result set, error object, success message string
})

/* GET error response . */
router.get('/error', async function (req, res, next) {
    const errorResponse = { data: 'errors' };
    sendErrorResponse(res, 500, null, errorResponse, 'error message'); //pass parameter as response object, status code, API Result set, error object, error message string
})




module.exports = router;