const jwt = require('jsonwebtoken')

const TokenValidate= async (req, res, next)=>{
    let token = req.headers['auth']

    // console.log("Hi : ", token)

    if(!token){
        res.json({invalid_token: true})
        next()
    }else{
        try{
            let decoded = await jwt.verify(token, 'secret')
            req.user = decoded
            next()
            // console.log("Come here")
        }catch(err){
            res.json({invalid_token: true})
        }
    }

}

module.exports = TokenValidate