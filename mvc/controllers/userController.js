
const users = require('../modals/userSchema')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb');

exports.register = async(req,res)=>{

    const {name,email,password} = req.body;

    try{
        const existingUser = await users.findOne({email});
        if(existingUser){
            res.status(406).json("User already exists")
        }
        else{
            const newUser = new users({
                name,
                email,
                password
            })

            await newUser.save()

            res.status(200).json("Registration Successfull")
        }
    }
    catch(err){
        console.log(err);
    }
}

exports.login = async(req,res)=>{
    const {email,password} = req.body;

    try{
        const existingUser = await users.findOne({email,password});

        if(existingUser){
            const token = jwt.sign({userId:existingUser._id},"instaKey07")
            res.status(200).json({
                token,
                existingUser
            })
        }
        else{
            res.status(401).json("Incorrect email or password")
        }
    }
    catch(err){
        res.status(406).json(err)
    }
}

exports.verifyUser = async(req,res)=>{
    const token = req.headers["authorization"].split(" ")[1];

    try{
        jwt.verify(token,"instaKey07")
        res.status(200).json({verify:true})
    }
    catch(err){
        res.status(401).json({verify:false})
    }
}

exports.getUserDetails = async(req,res)=>{
    const {userId} = req.body;

    try{
        const id = new ObjectId(userId);
        const result = await users.findOne({ _id:id })
        res.status(200).json(result);
    }catch(err){
        res.status(406).json(err)
    }
}

exports.updateUserDetails = async(req,res)=>{
    const {id,name,email,password} = req.body

    try{
        const _id = new ObjectId(id)
        const result = await users.findOne({_id})
        const update = {
            name,
            email,
            password
        }

        await users.updateOne({email:result.email},update)
        res.status(200).json(update)
    }catch(err){
        res.status(405).json(err)
    }
}