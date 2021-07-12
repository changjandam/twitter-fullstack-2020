const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

const helpers = require('../_helpers')

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

router.get('/', authenticated, (req, res) => res.redirect('/tweets'))

router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/users'))
// router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.signOut)

router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.post('/tweets/:id/replies', authenticated, tweetController.postReply)

router.post('/like/:tweetId', authenticated, userController.addLike)
router.delete('/like/:tweetId', authenticated, userController.removeLike)

router.get('/users/:id', authenticated, userController.userPage)
router.get('/users/:id/setting', authenticated, userController.getUserSetting)
router.get('/users/:id/replies', authenticated, userController.userPageReplies)
router.get('/users/:id/likes', authenticated, userController.userPageLikes)
router.put('/users/:id', authenticated, upload.fields([
  { name: 'avatarImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), userController.putProfile)

module.exports = router
