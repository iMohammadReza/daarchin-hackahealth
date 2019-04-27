const jwt = require('jsonwebtoken');

module.exports = (req , res , next) =>  {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        return jwt.verify(token , config.secret , (err , decode ) => {
            if(err) {
                return res.status(404).json({
                    success : false ,
                    error : 'Failed to authenticate token.'
                })
            }
            console.log(decode)
            req.user_id = decode.user_id
            next();
        })
    }

    return res.status(403).json({
        error : 'No Token Provided',
        success : false
    })
}