const router = require('express').Router();
const { updateUser, deleteUser, getUserListings, getUser } = require('../Controllers/user.controller.js');
const { verifyToken } = require('../utils/verifyUser.js');

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser);

module.exports = router