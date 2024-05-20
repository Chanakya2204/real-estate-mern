const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WdhdzVmMpbLBtUoewasFi-1BMvFDZ0tkQA&usqp=CAU"
    }
},{
    timestamps:true
});

module.exports=mongoose.model("User",userSchema);