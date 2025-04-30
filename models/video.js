module.exports = (sequelize, Model, DataTypes) => {
    class Video extends Model { }
    Video.init(
        {
            title: DataTypes.STRING,
            text: DataTypes.STRING,
        },
        { sequelize, modelName: 'video' },
    );
    return Video;
}