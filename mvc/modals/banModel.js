const mongoose = require('mongoose')

const banSchema = new mongoose.Schema({
    user:{
        type:String
    },
    cause:{}
})

const bans = mongoose.model("bans",banSchema)

module.exports = bans