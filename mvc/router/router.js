const express = require('express')

const router = new express.Router()

const userController = require('../controllers/userController')
const friendsController = require('../controllers/friendsController')
const chatController = require('../controllers/chatController')
const adminController = require('../controllers/adminController')
const emailController = require('../controllers/emailController')
const spamController = require('../controllers/spamController')
const banController = require('../controllers/banController')
const checkIfBanned = require('../MiddleWare/isBanned')

router.post('/register',userController.register)
router.post('/login',checkIfBanned,userController.login)
router.post('/verify',userController.verifyUser)
router.post('/getuser',userController.getUserDetails)
router.post('/updateUser',userController.updateUserDetails)

router.post('/add-friend',friendsController.addFriend)
router.post('/getFriendDetails',friendsController.getFriendDetails)
router.post('/removeFriends',friendsController.unfollow)

router.post('/storeMessage',chatController.newChat)
router.post('/getChat',chatController.getChat)

router.post('/bug',adminController.bugReport)
router.get('/getBug',adminController.getBugReport)
router.post('/removeBug',adminController.removeBug)
/* router.post('/reportUser',adminController.userReport) */
router.get('/getUserReport',adminController.getUserReport)

router.post('/newEmail',emailController.newEmail)
router.post('/getEmail',emailController.getEmail)
router.post('/deleteEmail',emailController.deleteEmail)

router.post('/spam',spamController,adminController.userReport)

router.post('/banUser',banController.banController)
router.post('/isbanned',banController.isUserBanned)

module.exports = router