const User = require('../Models/user.model.js');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/error.js');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
        const { username, email, password } = req.body;
        const hashedpassword = bcrypt.hashSync(password, 10);

        try {
                const newUser = await User.create({ username, email, password: hashedpassword });
                return res.json("User has been Created Successfully");
        } catch (e) {
                next(e)
        }
}

exports.signin = async (req, res, next) => {
        try {
                const validUser = await User.findOne({ email: req.body.email });
                if (!validUser) return next(errorHandler(404, 'User not found!'))
                const validPassword = await bcrypt.compareSync(req.body.password, validUser.password);
                if (!validPassword) return next(errorHandler(401, 'Wrong Credentials!'))

                const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
                const { password, ...rest } = validUser._doc
                return res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

        } catch (e) {
                next(e);
        }
}

exports.google = async (req, res, next) => {
        try {
                const user = await User.findOne({ email: req.body.email });
                if (user) {
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                        const { password, ...rest } = user._doc;
                        return res.cookie('access_token', token, { httpOnly: true })
                                .status(200)
                                .json(rest)
                } 
                else {
                        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                        const hashedPassword=bcrypt.hashSync(generatedPassword,10)
                        console.log('aaya 1');
                        const newUser=await User.create({
                                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                                email:req.body.email,
                                password:hashedPassword,
                                avatar:req.body.photo
                        });
                        console.log('aaya 2');
                        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
                        const {password,...rest}=newUser._doc;
                       return res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
                     }
        } catch (e) {
                        next(e)
        }
}

exports.signOut=async (req,res)=>{
        try {
                return res.clearCookie('access_token').status(200).json('User has been logged out Successfully');

        } catch (e) {
                next(e);
        }
}