
const mongoose = require('mongoose')

const friendsSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    friends:[String]
})

const friends = mongoose.model("friends",friendsSchema)

module.exports = friends;