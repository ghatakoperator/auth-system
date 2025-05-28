const path = require("path");
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("Loaded env:", {
    HOST: process.env.DB_HOST,
    DB: process.env.DB_DATABASE,
    USER: process.env.DB_USERNAME,
    PASS: process.env.DB_PASSWORD,
});
module.exports = {
    HOST: process.env.DB_HOST,
    PORT : process.env.DB_PORT,
    USER: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_DATABASE,
    dialect: "mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
};