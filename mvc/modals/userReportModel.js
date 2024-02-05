const mongoose = require('mongoose')

const userReportSchema = mongoose.Schema({
    user:{
        type:String
    },
    reports:[{}]
})

const reports = mongoose.model("reports",userReportSchema)

module.exports = reports