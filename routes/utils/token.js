const jwt = require('jsonwebtoken')
const secret = 'xixi'   // 混淆加密字段

// createToken
const createToken = (username) => {
    const token = jwt.sign({ 
        username: username 
    }, secret, {
        expiresIn: 24 * 60 * 60   // 到期时间 (s)
    })

    return token;
}

// checkToken
const checkToken = async(ctx, next) => {
    // 从header中取token
    
    const authorization = ctx.get('Authorization');
    
    if (authorization === '') {
        ctx.throw(401, 'no token detected in http header Authorization')
    }
    const token = authorization.split(' ')[1];
    let tokenContent;
    try {
        tokenContent = await jwt.verify(token, secret)  //如果token过期或验证失败，将抛出错误
    } catch (error) {
        ctx.throw(401, 'invalid token')
    }
    await next();
}

module.exports = {
    createToken,
    checkToken
}