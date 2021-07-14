const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim : true,
        unique:1
    },
    password :{
        type:String,
        minlength:50
    },
    role : {
        //관리자, 일반인 유저 구분 할 수 있게
        type:Number,
        default :0
    },
    image : String,
    token : {
        type: String
    },
    tokenExp:{
        type : Number
    }
})