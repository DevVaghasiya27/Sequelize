module.exports = (sequelize, Model, DataTypes) => {

    class User extends Model { }

    User.init(
        {
            // Model attributes are defined here
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isAlpha: {
                        msg: 'only alphabets are allowed'
                    },
                    isLowercase: {
                        msg: 'only lowercase are allowed'
                    },
                    len: [3, 10],
                },
                get() {
                    const rawValue = this.getDataValue('firstName');
                    return rawValue ? 'Mr. ' + rawValue.toUpperCase() : null;
                },
            },
            lastName: {
                type: DataTypes.STRING,
                // allowNull defaults to true
                allowNull: false,
                // defaultValue: 'Snow',
                // set(value) {
                //     // Storing passwords in plaintext in the database is terrible.
                //     // Hashing the value with an appropriate cryptographic hash function is better.
                //     this.setDataValue('lastName', value + ' , Indian');
                // }
            },
            fullName: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${this.firstName} ${this.lastName}`;
                },
                set(value) {
                    throw new Error('Do not try to set the `fullName` value!');
                },
            },
            status: DataTypes.INTEGER
        },
        {
            // // Hooks Method - 1:
            // hooks: {
            //     beforeValidate: (user, options) => {
            //         user.lastName = 'happy';
            //     },
            //     afterValidate: (user, options) => {
            //         user.status = 1;
            //     },
            // },
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'User', // We need to choose the model name
            // paranoid: true,
            // deletedAt: 'soft_delete'
        },
    );

    // // Method 2 via the .addHook() method
    // User.addHook('beforeValidate', (user, options) => {
    //     user.lastName = 'happy';
    // });

    // User.addHook('afterValidate', 'someCustomName', (user, options) => {
    //     user.status = 1
    // });

    // Method 3 via the direct method
    User.beforeCreate(async (user, options) => {
        user.lastName = 'patel'
    });

    User.afterValidate('myHookAfter', (user, options) => {
        user.status = 0;
    });

    User.removeHook('afterValidate', 'myHookAfter');
    // User.removeHook();

    return User;

}


// const { DataTypes } = require('sequelize');
// const sequelize = require('./index')

// const User = sequelize.define('User', {
//     // Model attributes are defined here
//     firstName: {
//         type: DataTypes.STRING,
//         defaultValue: 'John Doe',
//         allowNull: false,
//     },
//     middleName: {
//         type: DataTypes.STRING,
//         // allowNull defaults to true
//     },
//     lastName: {
//         type: DataTypes.STRING,
//         // allowNull defaults to true
//     },
// },
//     {
//         tableName: 'users',

//         // don't forget to enable timestamps!
//         timestamps: true,

//         // I don't want createdAt
//         createdAt: false,

//         // I want updatedAt to actually be called updateTimestamp
//         updatedAt: 'updateTimestamp',
//     },
// );

// // `sequelize.define` also returns the model
// console.log(User === sequelize.models.User); // true

// module.exports = User;