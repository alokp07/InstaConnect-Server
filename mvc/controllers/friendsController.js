const { ObjectId } = require('mongodb');
const friends = require('../modals/friendsSchema');
const users = require('../modals/userSchema');
const chats = require('../modals/chatModel')

exports.addFriend = async(req,res)=>{
    const {userId,friendId} = req.body;

    try{

        const user = await friends.findOne({userId})

        if(!user){
            const newFriend = new friends({
                userId,
                friends:[friendId]
            })

            await newFriend.save()
            res.status(200).json("friend added")
        }
        else{
            const existingFriend = user.friends.includes(friendId)

            if(!existingFriend){
                const friendsArr = user.friends;
                friendsArr.push(friendId)

                const update = {
                    userId,
                    friends:friendsArr
                }

                await friends.updateOne({userId},update)
                res.status(200).json("friend added")
            }
            else{
                res.status(404).json("existing friend")
            }
        }

        
        
    }catch(err){
        console.log(err);
        res.status(400).json(err)
    }
}

exports.getFriendDetails = async(req,res)=>{
    const {userId} = req.body

    try{

        const allFriends = await friends.find({userId})

        const loop = allFriends[0].friends.length;
        const resArray = []

        const getFriendData = async(data)=>{

            const objectId = new ObjectId(data);
            const result = await users.findOne({ _id: objectId });
            const temp = {
                name:result.name,
                userId:data
            }

            resArray.push(temp)
                
            if(resArray.length==loop){
                res.status(200).json(resArray)
            }
        }

        allFriends[0].friends.forEach(item=>{
            getFriendData(item)
        })

        if(resArray.length == 2){
            res.status(200).json("resArray")
        }

    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

exports.unfollow = async(req,res)=>{
    const {userId,friendId} = req.body;

    const clientOne = userId;
    const clientTwo = friendId;

    try {
        const allFriends = await friends.findOne({userId})
        const newFriends = allFriends.friends.filter(item=>item !=friendId)
        const data = {
            userId,
            friends:newFriends
        }
        await friends.updateOne({userId},data)

        const allFriends2 = await friends.findOne({userId:friendId})
        const newFriends2 = allFriends2.friends.filter(item=>item !=userId)
        const data2 = {
            friendId,
            friends:newFriends2
        }
        await friends.updateOne({userId:friendId},data2)   
        
        await chats.deleteOne({
            $or: [
              { clientOne, clientTwo },
              { clientOne: clientTwo, clientTwo: clientOne }
            ]
          });

        res.status(200).json(data)

    } catch (error) {
        res.status(406).json(error)
    }
}