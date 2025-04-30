const { createPoolCluster } = require("mysql2");

module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define(
        'customer',
        {
            username: DataTypes.STRING,
            points: DataTypes.INTEGER,
        },
        { timestamps: false },
    );
    return Customer;
}