const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        company: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        image: {
            type: DataTypes.BLOB("long"),
            allowNull: true,
        },

    }, {
        timestamps: false,
        tableName: "users",
    });

    return User;
};
