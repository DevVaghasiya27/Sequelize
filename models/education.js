module.exports = (sequelize, DataTypes) => {

    const Education = sequelize.define(
        'educations',
        {
            // Model attributes are defined here
            class_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            grade: {
                type: DataTypes.STRING,
                // allowNull defaults to true
            },
            passing_year: {
                type: DataTypes.STRING,
                // allowNull defaults to true
            },
            ContactId: DataTypes.INTEGER,
        },
        {
            // Other model options go here
        },
    );
    return Education;
}
