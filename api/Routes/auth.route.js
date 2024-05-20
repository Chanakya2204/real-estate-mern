const { signup, signin, google, signOut } = require('../Controllers/auth.controller.js');

const router=require('express').Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.get('/signout',signOut);

module.exports=router