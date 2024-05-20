const Listing = require("../Models/listing.model");
const User = require("../Models/user.model");
const { errorHandler } = require("../utils/error")
const bcrypt = require('bcrypt');

exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account'))
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })

        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json(rest)

    } catch (e) {
        next(e);
    }
}

exports.deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        return res.status(200).json('User has been deleted!')
    } catch (error) {
        next(error);
    }
}

exports.getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            return res.status(200).json(listings);
        } catch (e) {
            next(e)
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404, 'User not Found'));

        const { password, ...rest } = user._doc;
        return res.status(200).json(rest);
    } catch (e) {
        next(e.message)
    }
}