module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define(
        'profile',
        {
            name: DataTypes.STRING,
        },
        { timestamps: false },
    );
    return Profile
}