module.exports = (sequelize, DataTypes, User, Contact) => {
    const userContacts = sequelize.define('user_contacts', {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: User, // 'User' would also work
                key: 'id',
            },
        },
        contactId: {
            type: DataTypes.INTEGER,
            references: {
                model: Contact, // 'Contact' would also work
                key: 'id',
            },
        },
    }, {
        timestamps: false
    });
    return userContacts;
}