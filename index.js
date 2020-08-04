const express = require('express')
const shortid = require('shortid')

const server = express()
server.use(express.json())
const port = 5000

let users = [
    {
        id: "tsrN-PcMY",
        name: "Jane Doe",
        bio: "Not Tarzan's Wife, another Jane"
    }
]

server.post('/users', (req, res) => {
    const newUser = req.body
    console.log(req.body)
    if (newUser.name && newUser.bio) {
        newUser.id = shortid.generate()
        users.push(newUser)
        return(res.status(201).json(users))
    } else{
        return(res.status(400).json({errorMessage: 'Please provide name and bio for the user.'}))
    }

})

server.get('/users', (req, res) => {
    res.status(200).json(users)
})

server.get('/users/:id', (req, res) => {
    const user = users.filter(u => u.id === req.params.id)

    if (user.length > 0) {
        return(res.status(200).json(user))
    } else {
        return(res.status(404).json({errorMessage: 'The users information could not be retrieved'}))
    }
})

server.delete('/users/:id', (req, res) => {
    // console.log(users)
    // TODO: Add case for duplicate id
    const toDelete = users.filter(u => u.id === req.params.id)

    if (toDelete.length > 0) {
        users = users.filter(u => u.id !== req.params.id)
        if (users.filter(u => u.id === req.params.id).length === 1) {
            return res.status(500).json({errorMessage: 'The user could not be removed'})
        } else {
            return res.status(200).json(toDelete)
        }
    } else {
        res.status(404).json({errorMessage: 'The user with the specified ID does not exist'})
    }
})

server.put('/users/:id', (req, res) => {
    // TODO: Add case for duplicate id
    const toUpdate = users.filter(u => u.id === req.params.id)
    if (toUpdate.length === 1) {
        if (req.body.name && req.body.bio){
            const userIndex = users.findIndex(u => u.id === req.params.id)
            users[userIndex].bio = req.body.bio
            users[userIndex].name = req.body.name
            return res.status(200).json(users[userIndex])
        } else{
            return res.status(400).json({errorMessage: 'Please provide name and bio for the user'})
        }
    } else {
        return res.status(404).json({errorMessage: 'The user with the specified ID does not exist'})
    }
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})