const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    clientOne:{
        type:String
    },
    clientTwo:{
        type:String
    },
    messages:[{}]
})

const chats = mongoose.model("chats",chatSchema)

module.exports = chats