const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require("./config/key")

const {User} = require("./models/User");

//application/x-ww/form-urlencoded 가져온 것을 분석 
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected..'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!런런런111ffasdfasdf111')
})



app.post('/register', (req, res) => {
    //회원 가입 할때 필요한 정보들을 클라이언트에서 가져오면
    //그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)//json.형식으로 들어 있음
    //몽고디비 메소드
    user.save((err, userInfo) =>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success: true
        })
    })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


