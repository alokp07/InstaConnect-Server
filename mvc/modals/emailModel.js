const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    notification:[{}]
})

const emails = mongoose.model("emails",emailSchema)

module.exports = emails