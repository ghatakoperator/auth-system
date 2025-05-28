// models/otp.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Otp = sequelize.define(
        "otp",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            otp: {
                type: DataTypes.STRING(6),
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            used: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: false,
            tableName: "otps",
        }
    );

    return Otp;
};
