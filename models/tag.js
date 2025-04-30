module.exports = (sequelize, Model, DataTypes) => {
    class Tag extends Model {

    }
    Tag.init(
        {
            name: DataTypes.STRING,
        },
        { sequelize, modelName: 'tag' },
    );
    return Tag;
}