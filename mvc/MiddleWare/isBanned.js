const users = require('../modals/userSchema')
const bans = require('../modals/banModel')

const checkIfBanned = async(req,res,next)=>{
    const {email} = req.body;

    try {
        
        const result = await users.findOne({email})
        const user = result._id;
        const isBanned = await bans.findOne({user})

        if(isBanned){
            res.status(401).json("accout is banned")
        }
        else{
            next()
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = checkIfBanned