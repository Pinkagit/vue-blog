const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/xlblog', { 
    useNewUrlParser:true,
    useCreateIndex: true,
})

let db = mongoose.connection;
mongoose.Promise = global.Promise;

db.on('error', (err) => {
    console.log('数据库连接错误！')
    console.log(err);
})

db.on('open', () => {
    console.log("数据库连接成功！")
})

let userSchema = mongoose.Schema({
    username: String,
    password: String,
    token: String,
    create_time: Date,
    avatar: String,
})

let articleSchema = mongoose.Schema({
    author: String,
    title: String,
    introduction: String,
    content: String,
    tags: new Array(),
    create_time: Date,
    ispublish: Boolean,
    catalog: new Array(),
})

let inviteCodeSchema = mongoose.Schema({
    code: new Array()
})

let model = {
    User: mongoose.model('User', userSchema),
    Article: mongoose.model('Article', articleSchema),
    inviteCode: mongoose.model('inviteCode', inviteCodeSchema),
}

module.exports = model