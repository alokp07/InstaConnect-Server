const spams = require('../modals/spamModel');

const spamController = async(req,res,next)=>{
    const {userId,user} = req.body;

    try{
        const result = await spams.findOne({userId,reportedUser:user})

        if(result){
            res.status(400).json({})
        }
        else{
            const newSpam = new spams({
                userId,
                reportedUser:user
            })

            newSpam.save()
            next()
        }
    }catch(error){
        console.log(error);
        res.status(407).json(error)
    }
}

module.exports = spamController