
const emails = require('../modals/emailModel')

exports.newEmail = async(req,res)=>{
    const {userId,data} = req.body;

    try {

        const exists = await emails.findOne({userId})

        if(exists){
            const newEmail = exists.notification;
            newEmail.push(data)

            const update = {
                userId,
                notification:newEmail
            }

            await emails.updateOne({userId},update)

            res.status(200).json(newEmail)
        }   
        else{
            const newEmail = new emails({
                userId,
                notification:[data]
            })

            newEmail.save()

            res.status(200).json(newEmail)
        }
        
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.getEmail = async(req,res)=>{
    const {userId} = req.body;

    try {
        const result = await emails.findOne({userId})

        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(200).json({})
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.deleteEmail = async(req,res)=>{
    const {index,userId} = req.body;

    try {

        const result = await emails.findOne({userId})
        const newArr = result.notification;
        newArr.splice(index,1)

        const update = {
            userId,
            notification:newArr
        }

        await emails.updateOne({userId},update)
        res.status(200).json(newArr)
        
    } catch (error) {
        res.status(400).json(error)
    }
}