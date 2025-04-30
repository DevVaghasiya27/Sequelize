const { Sequelize, Model, DataTypes } = require('sequelize');
const contact = require('./contact');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');

const sequelize = new Sequelize('employeedb', 'root', '', {
    host: 'localhost',
    logging: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: 'mysql',
    // logging: false, // set to false if you don't want to see the SQL queries
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize, Model, DataTypes)
db.contact = require('./contact')(sequelize, DataTypes)
db.education = require('./education')(sequelize, DataTypes)
db.customer = require('./customer')(sequelize, DataTypes)
db.profile = require('./profile')(sequelize, DataTypes)
db.userContacts = require('./userContacts')(sequelize, DataTypes, db.user, db.contact)

// db.user.hasOne(db.contact, { foreignKey: 'user_id', as: 'contactDetails' });

db.user.hasMany(db.contact);
db.contactUser = db.contact.belongsTo(db.user)

db.contact.hasMany(db.education, { foreignKey: 'ContactId' });
db.education.belongsTo(db.contact, { foreignKey: 'ContactId' });

// db.user.belongsToMany(db.contact, { through: db.userContacts });
// db.contact.belongsToMany(db.user, { through: db.userContacts });

// const User_Profile = sequelize.define('User_Profile', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false,
//     },
//     selfGranted: DataTypes.BOOLEAN,
// }, { timestamps: false });

// db.customer.belongsToMany(db.profile, { through: User_Profile, uniqueKey: 'my_custom_unique', });
// db.profile.belongsToMany(db.customer, { through: User_Profile, uniqueKey: 'my_custom_unique', });

const Grant = sequelize.define('grant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    selfGranted: DataTypes.BOOLEAN,
}, { timestamps: false });

db.grant = Grant
// db.customer.belongsToMany(db.profile, { through: Grant, uniqueKey: 'my_custom_unique', });
// db.profile.belongsToMany(db.customer, { through: Grant, uniqueKey: 'my_custom_unique', });

db.player = sequelize.define('Player', { username: DataTypes.STRING });
db.team = sequelize.define('Team', { name: DataTypes.STRING });
db.game = sequelize.define('Game', { name: DataTypes.STRING });

db.gameTeam = sequelize.define('GameTeam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
});
db.team.belongsToMany(db.game, { through: db.gameTeam });
db.game.belongsToMany(db.team, { through: db.gameTeam });
db.gameTeam.belongsTo(db.game);
db.gameTeam.belongsTo(db.team);
db.game.hasMany(db.gameTeam);
db.team.hasMany(db.gameTeam);

// Super Many-to-Many relationship between Player and GameTeam
db.playerGameTeam = sequelize.define('PlayerGameTeam', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
});
db.player.belongsToMany(db.gameTeam, { through: db.playerGameTeam });
db.gameTeam.belongsToMany(db.player, { through: db.playerGameTeam });
db.playerGameTeam.belongsTo(db.player);
db.playerGameTeam.belongsTo(db.gameTeam);
db.player.hasMany(db.playerGameTeam);
db.gameTeam.hasMany(db.playerGameTeam);

db.image = require('./image')(sequelize, Model, DataTypes)
db.video = require('./video')(sequelize, Model, DataTypes)
db.comment = require('./comment')(sequelize, Model, DataTypes)
db.tag = require('./tag')(sequelize, Model, DataTypes)
db.tagTaggable = require('./tag_taggable')(sequelize, Model, DataTypes)

db.image.hasMany(db.comment, {
    foreignKey: 'commentableId',
    constraints: false,
    scope: {
        commentableType: 'image',
    },
});
db.comment.belongsTo(db.image, { foreignKey: 'commentableId', constraints: false });

db.video.hasMany(db.comment, {
    foreignKey: 'commentableId',
    constraints: false,
    scope: {
        commentableType: 'video',
    },
});
db.comment.belongsTo(db.video, { foreignKey: 'commentableId', constraints: false });

// Setup a One-to-Many relationship between User and Grant
db.customer.hasMany(db.grant);
db.grant.belongsTo(db.customer);
// Also setup a One-to-Many relationship between Profile and Grant
db.profile.hasMany(db.grant);
db.grant.belongsTo(db.profile);

db.image.belongsToMany(db.tag, {
    through: {
        model: db.tagTaggable,
        unique: false,
        scope: {
            taggableType: 'image',
        },
    },
    foreignKey: 'taggableId',
    constraints: false,
});

db.tag.belongsToMany(db.image, {
    through: {
        model: db.tagTaggable,
        unique: false,
    },
    foreignKey: 'tagId',
    constraints: false,
});

db.video.belongsToMany(db.tag, {
    through: {
        model: db.tagTaggable,
        unique: false,
        scope: {
            taggableType: 'video',
        },
    },
    foreignKey: 'taggableId',
    constraints: false,
});

db.tag.belongsToMany(db.video, {
    through: {
        model: db.tagTaggable,
        unique: false,
    },
    foreignKey: 'tagId',
    constraints: false,
});

db.post = sequelize.define(
    'post',
    {
        content: DataTypes.STRING,
    },
    { timestamps: false },
);

db.reaction = sequelize.define(
    'reaction',
    {
        type: DataTypes.STRING,
    },
    { timestamps: false },
);

db.post.hasMany(db.reaction);
db.reaction.belongsTo(db.post);

db.DataTypes = DataTypes;

db.sequelize.sync({ force: false })

module.exports = db;