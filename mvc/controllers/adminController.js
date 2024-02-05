
const admins = require('../modals/adminModel')
const reports = require('../modals/userReportModel');
const { updateOne } = require('../modals/userSchema');

exports.bugReport = async(req,res)=>{
    const data = req.body;
    
    try {

        const result = await admins.find({})
        const newBug = result[0].bug
        const user = result[0].user
        const index = result[0].bug.length-1
        if(result[0].bug.length>0){
            data.id = result[0].bug[index].id + 1
        }
        newBug.push(data)
        
        const update = {
            bug:newBug,
            user
        }

        await admins.updateOne({},update)
        res.status(200).json(update)
        
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}

exports.getBugReport = async(req,res)=>{
    try {
        
        const result = await admins.findOne({})
        res.status(200).json(result.bug)

    } catch (error) {
        res.status(400).json(error)
    }
}

exports.removeBug = async(req,res)=>{
    const {id}= req.body;

    try {
        const result = await admins.findOne({})
        const newBug = result.bug.filter(item=>item.id != id)
        const user = result.user

        const update = {
            bug:newBug,
            user
        }

        await admins.updateOne({},update)
        res.status(200).json(update)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.userReport = async(req,res)=>{
    const {user,msg} = req.body

    try {
        console.log("inside");
        const result = await reports.findOne({user})

        if(result){
            const newReports = result.reports;
            newReports.push(msg)

            const data = {
                user,
                reports:newReports
            }

            await reports.updateOne({user},data)

            res.status(200).json(data)
        }
        else{

            const data = new reports({
                user,
                reports:[msg]
            })

            await data.save()

            res.status(200).json(data)
        }

        
        
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.getUserReport = async(req,res)=>{
    try {
        
        const result = await reports.find({})
        res.status(200).json(result)

    } catch (error) {
        res.status(400).json(error)
    }
}
