const mongoose = require('mongoose')

const spamSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    reportedUser:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24 * 60 * 60,
    }
})


const spams = mongoose.model('spams',spamSchema)

module.exports = spams