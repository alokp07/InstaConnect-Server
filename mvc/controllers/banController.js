
const bans = require('../modals/banModel')
const reports = require('../modals/userReportModel')

exports.banController = async(req,res)=>{
    const {user,cause} = req.body;

    try {
        const result = await bans.findOne({user})

        if(result){
            res.status(400).json("Somthing went wrong")
        }
        else{
            const newBan = new bans({
                user,
                cause
            })

            await reports.deleteOne({user})

            newBan.save()
            res.status(200).json(newBan)
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.isUserBanned = async(req,res)=>{
    const {user} = req.body;

    try{

        const result = await bans.findOne({user})

        if(result){
            res.status(401).json(result)
        }
        else{
            res.status(200).json("user is not banned")
        }

    }catch(err){
        res.status(405).json(err)
    }
}