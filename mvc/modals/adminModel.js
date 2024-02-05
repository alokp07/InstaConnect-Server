const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    bug:[{}]
})

const admins = mongoose.model("admins",adminSchema)

module.exports = admins