var createError = require('http-errors');
require("dotenv").config({ override: true });
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const cors = require("cors");
var bodyParser = require('body-parser');

const http = require("http");

(async () => {

    var indexRouter = require('./routes/index');
    var userRouter = require('./routes/api/user.route');

    var app = express();
    const port = 3001;

    app.locals.moment = require("moment");
    app.use(cors());
    app.use(bodyParser.json({ limit: '500mb' }));
    app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 5000000 }));

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Credentials", 'true');
        next();
    });

    const db = require("./models");
    db.sequelize.sync();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use('/', indexRouter);
    app.use('/user', userRouter);

    app.use(function (req, res, next) {
        next(createError(404));
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message,
            error: req.app.get("env") === "development" ? err : {}
        });
    });

    var httpServer = http.createServer(app);
    httpServer.listen(port, () =>
        console.log(` listening at http://localhost:${port}`)
    );

    module.exports = app;

})();
