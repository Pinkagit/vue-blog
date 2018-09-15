const Koa = require('koa')
const Router = require('koa-router')()
const body = require('koa-body')
const static = require('koa-static')
const path = require('path')

const app = new Koa()

// 静态资源相对于index.js的路径
const staticPath = './static'

// middlewares
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

app.use(body())
app.use(static(
    path.join(__dirname, staticPath)
))
app.use(Router.routes(), Router.allowedMethods())

// router
const user = require('./routes/user')
const article = require('./routes/article')

Router.use('/user', user.routes(), user.allowedMethods())
Router.use('/article', article.routes(), article.allowedMethods())

// 
app.listen(3000, () => {
    console.log("Server starting at port 3000.");
})
