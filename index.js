const express = require('express')
const bodyParser = require('body-parser')
require('./models');
var userCtrl = require('./controllers/userController')
const app = express()
const port = 8000

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/add', userCtrl.addUser)
app.get('/users', userCtrl.getUsers)
app.get('/user/:id', userCtrl.getUser)
app.post('/Users', userCtrl.postUsers)
app.delete('/user/:id', userCtrl.deleteUser)
app.patch('/user/:id', userCtrl.patchUser)
app.get('/query', userCtrl.queryUser)
app.get('/finders', userCtrl.findersUser)
app.get('/get-set-virtual', userCtrl.getSetVirtualUser)
app.get('/validate', userCtrl.validateUser)
app.get('/raw-queries', userCtrl.rawQueriesUser)
app.get('/one-to-one', userCtrl.oneToOneUser)
app.get('/one-to-many', userCtrl.oneToManyUser)
app.get('/many-to-many', userCtrl.manyToManyUser)
app.get('/paranoid', userCtrl.paranoidUser)
app.get('/loading', userCtrl.loadingUser)
app.get('/eager', userCtrl.eagerUser)
app.get('/creator', userCtrl.creatorUser)
app.get('/m-n-associations', userCtrl.mnAssociationsUser)
app.get('/m2m2m', userCtrl.m2m2mUser)
app.get('/scopes', userCtrl.scopesUser)
app.get('/transactions', userCtrl.transactionsUser)
app.get('/hooks', userCtrl.hooksUser)
app.get('/polyOneToMany', userCtrl.polyOneToManyUser)
app.get('/polyManyToMany', userCtrl.polyManyToManyUser)
app.get('/query-interface', userCtrl.queryInterfaceUser)
app.get('/sub-query', userCtrl.subQueryUser)

// User.sync({ force: true })
// Contact.sync({ force: true })

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})