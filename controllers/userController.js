const { Sequelize, Op, QueryTypes, where } = require('sequelize');

var db = require('../models')
var User = db.user;
var Contact = db.contact;
var Education = db.education;

var addUser = async (req, res) => {
    const jane = await User.create({ firstName: 'Dev', lastName: 'Vaghasiya' });
    // const jane = await User.build({ firstName: 'Dev', lastName: 'Vaghasiya' });
    console.log(jane instanceof User); // true
    console.log(jane.firstName);
    // await jane.set({ firstName: 'James', lastName: 'Bond' })
    await jane.update({ firstName: 'John', lastName: 'Wick' })
    // await jane.save();
    console.log('Jane was saved to the database!');
    // await jane.destroy();
    console.log(jane.toJSON())
    res.status(200).json(jane.toJSON())
}

var getUsers = async (req, res) => {
    const data = await User.findAll({});
    res.status(200).json({ data: data });
}

var getUser = async (req, res) => {
    const data = await User.findOne({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({ data: data });
}

var postUsers = async (req, res) => {
    var postData = req.body;
    if (postData.length > 1) {
        var data = await User.bulkCreate(postData);
    } else {
        var data = await User.create(postData);
    }
    res.status(200).json({ data: data });
}

var deleteUser = async (req, res) => {
    const data = await User.destroy({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({ data: data });
}

var patchUser = async (req, res) => {
    var updatedData = req.body;
    const data = await User.update(updatedData, {
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({ data: data });
}

var queryUser = async (req, res) => {
    const data = await User.findAll({
        // attributes: ['id', 'firstName'],

        // attributes: ['id', ['firstName', 'first_name']],

        // attributes: ['id', ['firstName', 'first_name'],
        //     [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],

        // attributes: { exclude: ['lastName'] }

        // attributes: {
        //     exclude: ['firstName', 'lastName'],
        //     include: ['id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']]
        // }

        // where: { id: { [Op.eq]: 4, }, },

        // where: {
        //     [Op.and]: [{ id: 1 }, { firstName: 'Dev' }],
        // },

        order: [
            // Will escape id and validate DESC against a list of valid direction parameters
            ['id', 'DESC'],
        ]

    });
    res.status(200).json({ data: data });
}

// var queryUser = async (req, res) => {
//     const data = await User.create({
//         firstName: 'John',
//         lastName: 'Snow'
//     }, { fields: ['firstName', 'lastName'] });
//     res.status(200).json({ data: data });
// }

var findersUser = async (req, res) => {
    // const data = await User.findOne({
    //     where: {
    //         firstName: 'John'
    //     }
    // })

    // const data = await User.findByPk(5)

    // const [user, created] = await User.findOrCreate({
    //     where: { firstName: 'pablo' },
    //     defaults: {
    //         lastName: 'Escobar',
    //     },
    // });

    const { count, rows } = await User.findAndCountAll({
        where: { firstName: 'John' }
    });

    res.status(200).json({ data: count, rows: rows });
}

var getSetVirtualUser = async (req, res) => {
    const data = await User.findAll({
        where: { firstName: 'John' }
    });

    // const data = await User.create({
    //     firstName: 'John',
    //     lastName: 'Wick',

    // });

    res.status(200).json({ data: data });
}

var validateUser = async (req, res) => {
    var data = {};
    var messages = {};
    try {
        data = await User.create({
            firstName: 'dev',
            lastName: 'Vaghasiya'
        });
    } catch (e) {
        // console.log("🚀 ~ validateUser ~ error:", e.errors)
        let message;
        e.errors.forEach(error => {
            switch (error.validatorKey) {
                case 'isAlpha':
                    message = error.message
                    break;
                case 'isLowercase':
                    message = error.message
                    break;
                case 'len':
                    message = 'length should be 3 to 10';
                    break;
            }
            messages[error.path] = message
        })
    }

    res.status(200).json({ data: data, messages: messages });
}

var rawQueriesUser = async (req, res) => {
    const users = await db.sequelize.query('SELECT * FROM users WHERE lastName = ?', {
        replacements: ['vaghasiya'],
        type: QueryTypes.SELECT,
    });
    // We didn't need to destructure the result here - the results were returned directly
    res.status(200).json({ data: users });
}

var oneToOneUser = async (req, res) => {
    // var data = await User.create({ firstName: 'vaghasiya', lastName: 'dev' });
    // if (data && data.id) {
    //     await Contact.create({ permanent_address: 'abc', current_address: 'xyz', user_id: data.id })
    // }

    var data = await User.findAll({
        attributes: ['firstName', 'lastName'],
        include: [{
            model: Contact,
            as: 'contactDetails',
            attributes: ['permanent_address', 'current_address']
        }],
        where: { id: 2 }
    })

    // var data = await Contact.findAll({
    //     attributes: ['permanent_address', 'current_address'],
    //     include: [{
    //         model: User,
    //         attributes: ['firstName', 'lastName'],
    //     }],
    //     where: { id: 1 }
    // })

    res.status(200).json({ data: data })
}

var oneToManyUser = async (req, res) => {
    // var data = await Contact.create({
    //     permanent_address: 'Ahmadabad', current_address: 'Rajkot', user_id: 1

    // })
    // res.status(200).json({ data: data })

    var data = await User.findAll({
        attributes: ['firstName', 'lastName'],
        include: [{
            model: Contact,
            as: 'contactDetails',
            attributes: ['permanent_address', 'current_address']
        }],
        where: { id: 2 }
    })

    // var data = await Contact.findAll({
    //     attributes: ['permanent_address', 'current_address'],
    //     include: [{
    //         model: User,
    //         attributes: ['firstName', 'lastName']
    //     }],
    //     where: { id: 2 }
    // })

    res.status(200).json({ data: data })
}

var manyToManyUser = async (req, res) => {
    // var data = await User.create({ firstName: 'vaghasiya', lastName: 'dev' });
    // if (data && data.id) {
    //     await Contact.create({ permanent_address: 'ahmadabad', current_address: 'rajkot' })
    // }
    // var data = {}
    // res.status(200).json({ data: data })

    // var data = await User.findAll({
    //     attributes: ['firstName', 'lastName'],
    //     include: [{
    //         model: Contact,
    //         attributes: ['permanent_address', 'current_address']
    //     }],
    //     // where: { id: 2 }
    // })

    var data = await Contact.findAll({
        attributes: ['permanent_address', 'current_address'],
        include: [{
            model: User,
            attributes: ['firstName', 'lastName']
        }],
        // where: { id: 2 }
    })

    res.status(200).json({ data: data })
}

var paranoidUser = async (req, res) => {
    // var data = await User.create({ firstName: 'dev', lastName: 'vaghasiya' })
    // var data = await User.destroy({
    //     where: {
    //         id: 7,
    //     },
    //     // force: true
    // });
    // var data = await User.restore({
    //     // where: {
    //     //     id: 7
    //     // }
    // });
    // var data = await User.findAll({})
    // var data = await User.findAll({paranoid: false})
    var data = await User.findByPk(5, { paranoid: false })
    res.status(200).json({ data: data })
}

var loadingUser = async (req, res) => {
    // var data = await User.create({ firstName: 'divyesh', lastName: 'patel' });
    // if (data && data.id) {
    //     await Contact.create({ permanent_address: 'ahmadabad', current_address: 'rajkot', UserId: data.id })
    // }

    // var data = await User.findOne({
    //     where: {
    //         id: 2
    //     }
    // })
    // var contactData = await data.getContacts();
    // res.status(200).json({ data: data, contactData: contactData })

    var data = await User.findAll({
        attributes: ['firstName', 'lastName'],
        include: [{
            model: Contact,
            attributes: ['permanent_address', 'current_address']
        }]
    })
    res.status(200).json({ data: data })
}

var eagerUser = async (req, res) => {
    var data = await User.findAll({
        // include: [{
        //     model: Contact,
        //     required: false,
        //     right: true,
        // }, {
        //     model: Education
        // }]
        // include: { all: true, nested: true }
        include: {
            model: Contact,
            include: {
                model: Education,
                where: {
                    id: 1
                }
            },
            where: {
                id: 2
            }
        }
    })
    res.status(200).json({ data: data })
}

var creatorUser = async (req, res) => {
    // var data = await User.create({ firstName: 'dev', lastName: 'vaghasiya' });
    // if (data && data.id) {
    //     await Contact.create({ permanent_address: 'rajkot', current_address: 'ahmadabad', UserId: data.id })
    // }
    await Contact.bulkCreate([{
        permanent_address: 'rajkot',
        current_address: "ahmadabad",
        users: {
            firstName: 'dev',
            lastName: 'vaghasiya'
        }
    }, {
        permanent_address: 'ahmadabad',
        current_address: "rajkot",
        users: {
            firstName: 'divyesh',
            lastName: 'patel'
        }
    }], {
        include: [db.contactUser]
    })
    var data = await User.findAll({
        include: {
            model: Contact
        }
    })
    res.status(200).json({ data: data })
}

// var mnAssociationsUser = async (req, res) => {
//     // const amidala = await db.customer.create({ username: 'p4dm3', points: 1000 });
//     // const queen = await db.profile.create({ name: 'Queen' });
//     // await amidala.addProfile(queen, { through: { selfGranted: false } });
//     // const result = await db.customer.findOne({
//     //     where: { username: 'p4dm3' },
//     //     include: db.profile,
//     // });

//     const amidala = await db.customer.create(
//         {
//             username: 'p4dm3',
//             points: 1000,
//             profiles: [{
//                 name: 'Queen',
//                 User_Profile: {
//                     selfGranted: true,
//                 },
//             },],
//         }, {
//         include: db.profile,
//     },
//     );

//     // const result = await db.customer.findOne({
//     //     where: { username: 'p4dm3' },
//     //     include: db.profile,
//     // });

//     var result = await db.customer.findAll({
//         include: {
//             model: db.grant,
//             include: db.profile,
//         },
//     });

//     res.status(200).json({ data: result })
// }

var mnAssociationsUser = async (req, res) => {
    try {
        // Step 1: Create the Customer
        const amidala = await db.customer.create({
            username: 'p4dm3',
            points: 1000,
        });

        // Step 2: Create the Profile
        const queenProfile = await db.profile.create({
            name: 'Queen',
        });

        // Step 3: Create the Grant linking customer and profile
        await db.grant.create({
            selfGranted: true,
            customerId: amidala.id,    // FK from grant
            profileId: queenProfile.id // FK from grant
        });

        // Step 4: Query back the customer with nested grant and profile
        const result = await db.customer.findAll({
            include: {
                model: db.grant,
                include: db.profile,   // profile comes inside grant
            },
        });

        res.status(200).json({ data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

var m2m2mUser = async (req, res) => {
    await db.player.bulkCreate([
        { username: 's0me0ne' },
        { username: 'empty' },
        { username: 'greenhead' },
        { username: 'not_spock' },
        { username: 'bowl_of_petunias' },
    ]);
    await db.game.bulkCreate([
        { name: 'The Big Clash' },
        { name: 'Winter Showdown' },
        { name: 'Summer Beatdown' },
    ]);
    await db.team.bulkCreate([
        { name: 'The Martians' },
        { name: 'The Earthlings' },
        { name: 'The Plutonians' },
    ]);

    await db.gameTeam.bulkCreate([
        { gameId: 1, teamId: 1 }, // ✅ Correct field names
        { gameId: 1, teamId: 2 },
        { gameId: 2, teamId: 1 },
        { gameId: 2, teamId: 3 },
        { gameId: 3, teamId: 2 },
        { gameId: 3, teamId: 3 },
    ]);


    await db.playerGameTeam.bulkCreate([
        { playerId: 1, gameTeamId: 3 },
        { playerId: 3, gameTeamId: 3 },
        { playerId: 4, gameTeamId: 4 },
        { playerId: 5, gameTeamId: 4 },
    ]);


    const data = await db.game.findOne({
        where: {
            name: 'Winter Showdown',
        },
        include: {
            model: db.gameTeam,
            include: [
                {
                    model: db.player,
                    through: { attributes: [] }, // Hide unwanted `PlayerGameTeam` nested object from results
                },
                db.team,
            ],
        },
    });

    res.status(200).json({ data: data })
}

var scopesUser = async (req, res) => {
    User.addScope('checkStatus', {
        where: {
            status: 0
        }
    })

    User.addScope('lastName', {
        where: {
            lastName: 'vaghasiya'
        }
    })

    // var data = await User.scope(['lastName', 'checkStatus']).findAll({});

    User.addScope('includeContact', {
        include: {
            model: Contact,
            attributes: ['current_address']
        }
    })
    User.addScope('userAttribute', {
        attributes: ['firstName']
    })
    User.addScope('limitApply', {
        limit: 2
    })

    let data = await User.scope(['includeContact', 'userAttribute', 'limitApply']).findAll({})
    res.status(200).json({ data: data })
}

// var transactionsUser = async (req, res) => {

//     const t = await db.sequelize.transaction();

//     var data = await User.create({ firstName: 'vaghasiya', lastName: 'dev' });
//     if (data && data.id) {
//         try {
//             await Contact.create({ permanent_address: 'rajkot', current_address: 'ahmadabad', 'userId': data.id })
//             await t.commit();
//             console.log("commit")
//         } catch (error) {
//             await t.rollback();
//             console.log("rollback")
//             await User.destroy({
//                 where: {
//                     id: data.id
//                 }
//             })
//         }
//     }
//     res.status(200).json({ data: data })
// }

var transactionsUser = async (req, res) => {
    try {
        const result = await db.sequelize.transaction(async (t) => {
            var contact = await Contact.create({
                permanent_address: 'rajkot', current_address: 'ahmadabad', users: {
                    firstName: 'dev',
                    lastName: 'vaghasiya'
                }
            }, { include: [db.contactUser] })
            return contact;
        });
        console.log("🚀 ~ transactionsUser ~ result:", result)
    } catch (error) {
        console.log("🚀 ~ transactionsUser ~ error:", error)
        // await User.destroy({
        //     where: {
        //         id: data.id
        //     }
        // })
    }
    res.status(200).json({ data: {} })
}

var hooksUser = async (req, res) => {
    var data = await User.create({ firstName: 'dev', lastName: 'vaghasiya', status: 0 });
    res.status(200).json({ data: data })
}

var Image = db.image;
var Video = db.video;
var Comment = db.comment;
var Tag = db.tag;
var TagTaggable = db.tagTaggable;
var polyOneToManyUser = async (req, res) => {
    // // var imageData = await Image.create({ title: 'First Image', url: 'first_url' })
    // var imageData = {};
    // var videoData = await Video.create({ title: '2nd Video', text: 'Awesome video' })
    // if (imageData && imageData.id) {
    //     await Comment.create({ title: 'First Comment for Image', commentableId: imageData.id, commentableType: 'image' });
    // }
    // if (videoData && videoData.id) {
    //     await Comment.create({ title: '2nd Comment for Video', commentableId: videoData.id, commentableType: 'video' });
    // }

    // image to comment

    // var imageCommentData = await Image.findAll({
    //     include: [{
    //         model: Comment
    //     }]
    // })

    // var imageCommentData = await Video.findAll({
    //     include: [{
    //         model: Comment
    //     }]
    // })

    // var imageCommentData = await Comment.findAll({
    //     include: [{
    //         model: Video
    //     }]
    // })

    var imageCommentData = await Comment.findAll({
        include: [{
            model: Image
        }]
    })

    res.status(200).json({ data: imageCommentData })
}

var polyManyToManyUser = async (req, res) => {
    // var data = {}
    // var imageData = await Image.create({ title: 'First Image', url: 'first_url' })
    // var videoData = await Video.create({ title: 'second Video', text: 'Awesome videos' })
    // var tagData = await Tag.create({ name: 'nodejs' })
    // if (tagData && tagData.id && imageData && imageData.id) {
    //     await TagTaggable.create({ tagId: tagData.id, taggableId: imageData.id, taggableType: 'image' });
    // }
    // if (tagData && tagData.id && videoData && videoData.id) {
    //     await TagTaggable.create({ tagId: tagData.id, taggableId: videoData.id, taggableType: 'video' });
    // }
    // var data = await Image.findAll({
    //     include: [Tag]
    // })
    // var data = await Video.findAll({
    //     include: [Tag]
    // })
    var data = await Tag.findAll({
        include: [Video, Image]
    })
    res.status(200).json({ data: data })
}

var queryInterfaceUser = async (req, res) => {
    var data = {}
    const queryInterface = db.sequelize.getQueryInterface();
    // queryInterface.createTable('Person', {
    //     name: db.DataTypes.STRING,
    //     isBetaMember: {
    //         type: db.DataTypes.BOOLEAN,
    //         defaultValue: false,
    //         allowNull: false,
    //     },
    // });
    // queryInterface.addColumn('Person', 'petName', { type: db.DataTypes.STRING });
    queryInterface.changeColumn('Person', 'petName', {
        type: db.DataTypes.FLOAT,
        defaultValue: 3.14,
        allowNull: false,
    });
    res.status(200).json({ data: data })
}

async function makePostWithReactions(content, reactionTypes) {
    const post = await db.post.create({ content });
    await db.reaction.bulkCreate(reactionTypes.map(type => ({ type, postId: post.id })));
    return post;
}

var subQueryUser = async (req, res) => {
    // var data = await makePostWithReactions('Hello World', [
    //     'Like', 'Angry', 'Laugh', 'Like', 'Like', 'Angry', 'Sad', 'Like',
    // ]);
    // await makePostWithReactions('My Second Post', ['Laugh', 'Laugh', 'Like', 'Laugh']);

    var data = await db.post.findAll({
        attributes: {
            include: [
                [
                    // Note the wrapping parentheses in the call below!
                    db.sequelize.literal(`(
                          SELECT COUNT(*)
                          FROM reactions AS reaction
                          WHERE
                              reaction.postId = post.id
                              AND
                              reaction.type = "Laugh"
                      )`),
                    'laughReactionsCount',
                ],
            ],
        },
        order: [[db.sequelize.literal('laughReactionsCount'), 'DESC']],
    });

    res.status(200).json({ data: data })
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    postUsers,
    deleteUser,
    patchUser,
    queryUser,
    findersUser,
    getSetVirtualUser,
    validateUser,
    rawQueriesUser,
    oneToOneUser,
    oneToManyUser,
    manyToManyUser,
    paranoidUser,
    loadingUser,
    eagerUser,
    creatorUser,
    mnAssociationsUser,
    m2m2mUser,
    scopesUser,
    transactionsUser,
    hooksUser,
    polyOneToManyUser,
    polyManyToManyUser,
    queryInterfaceUser,
    subQueryUser
}   