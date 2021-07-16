const { User } = require('../models/User');


let auth = (req, res, next) => {

    //인증 처리를 하는 곳

    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    //토큰을 복호화 한후 유저를 찾는다.
    User.findByToken(token, (err, user) =>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        //토큰이 있다면, 다른곳에서도  토큰과 유저를 사용할 수 있게 넣어줌
        req.token = token;
        req.user =user;
        //다음으로 진행 할 수 있게
        next();
    })

    //유저가 있으면 인증 성공

    //유저가 없으면 인증 실패

}

module.exports = {auth} ;