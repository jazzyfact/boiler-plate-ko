const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 //10자리인 salt를 이용해 비밀번호를 암호화한다
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//유저모델 저장하기 전에
userSchema.pre('save',function(next){
    const user = this;


    //패스워드가 변경 될 때 마다 암호화 
    if(user.isModified('password')){
         //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        //paln password 들어가있음
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash//hash형태로 바꿔줌
            next()
            })
        })
    }else {
        next()
    }
})



userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    //plainPassword 1234567 암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)//에러는 없고 비밀번호는 같다
    })
}

userSchema.methods.generateToken = function(cb) {

    const user = this;

    //jsonwebtoken을 이용하여 토큰을 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
            cb(null, user)
    })

   
}


userSchema.statics.findByToken = function(token, cb){
    
    const user =this;

    //user._id= " " = token 넣어줌
    //토큰을 decode 한다
    jwt.verify(token, 'secretToken', function(err, decoded){

        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token" : token}, function(err, user){

            if(err) return cb(err);
            cb(null, user)
        })
    })


    
}



const User = mongoose.model('User', userSchema)

//다른곳에서도 사용할 수 있게
module.exports = { User }