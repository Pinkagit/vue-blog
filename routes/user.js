const router = require('koa-router')()
const tokenController = require('./utils/token')
const dbController = require('../db/controller')
const body = require('koa-body')
const common = require('./utils/common')
const sha1 = require('sha1')
const path = require('path')
const fs = require('fs')
const log = require('../log')
const moment = require('moment');

// 登入
router.post('/login', async function (ctx, next) {
    ctx.state.username = ctx.request.body.username
    await next();
})
router.post('/login', async function (ctx, next) {

    let username = ctx.request.body.username;
    let password = sha1(ctx.request.body.password);

    let registered, ret, sta, token;
    
    // 查询是否有该用户
    await dbController.findUser(username).then(v => {
        registered = v
    }).catch(e => {
        console.log(e)
    })

    if (!registered) {
        ret =  '用户不存在！';
        sta = 0;
    } else if (registered.password == password) {

        // 生成一个新的token，并保存到数据库
        let _token = tokenController.createToken(username);
        registered.token = _token;
        await new Promise((resolve, reject) => {
            registered.save((err, rep) => {
                if (err) {
                    reject(err)
                }
                resolve()
            })
        }).then(v => {
            sta = 1;
            ret = '登入成功!';
            token = _token;
        }).catch(e => {
            console.log("Error:[registered.save] ", e);
        })
    } else {
        sta = 0;
        ret = '密码错误！';
        token = '';
    }

    // log
    log.logger.info(`Blog: Login ,username: ${ctx.state.username}, sta:${sta}`)
    
    ctx.response.body = {
        sta,
        msg: ret,
        token,
    }
})

// 上传头像配置
const confupload = body({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 5 * 1024 * 1024,           // 限制字段的最大大小
        uploadDir: path.join(__dirname, `../static/upload/temp`),    // 上传的文件存储的路径 
        keepExtensions: true,                   //  保留原来的文件后缀
        onFileBegin: async (name, file) => {    // 文件上传前设置
            // 获取文件后缀名
            const ext = common.getUploadFileExt(file.name)
            // 生成文件名
            const fileName = common.setFileName()
            // 设置文件名
            file.name = `${fileName}.${ext}`
            // 文件最终要保存到的文件目录
            const dir = path.join(__dirname, `../static/upload/avatar`)
            // 重设置文件保存地址
            file.path = `${dir}/${file.name}`;
        }
    },
    onError: function (err) {
        console.log("upload err", err)
    }
})

// 注册
router.post('/register', confupload, async function (ctx, next) {
    let user = {
        username: ctx.request.body.username,
        password: sha1(ctx.request.body.password),
        token: tokenController.createToken(ctx.request.body.username),
        avatar: '',
    }

    // 检测用户是否存在，并添加数据库
    let regInfo = await dbController.Register(user);
    
    let msg, sta;
    if (regInfo.registered === 0) {
        msg = '用户已存在！';
        sta = 0;
    } else if (regInfo.registered === 1) {
        msg = '注册成功！';
        sta = 1;    
    } else {
        msg = '注册失败！';
        sta = 0;
    }

    // log
    log.logger.info(`Blog: Register ,username: ${user.username}, sta: ${sta}`)

    if (sta == 1) {         // 修改头像名字
        let oldFileName, oldPath, newPath;
        for (let i in ctx.request.files) {
            oldPath = ctx.request.files[i].path;
            oldFileName = ctx.request.files[i].name;
        }
        // 获取文件后缀名
        // let ext = common.getUploadFileExt(oldFileName);
        let ext = 'png';
        // 获取头像文件夹路径
        let Parpath = path.dirname(oldPath);
        // 生成新文件名
        let newFileName = regInfo.id + '.' + ext;
        // 生成新文件地址
        newPath = path.join(Parpath, newFileName);
        // 文件重命名
        let nextStep = false;
        await common.renameFile(oldPath, newPath).then(v => {
            console.log(v);
            nextStep = true;
        }).catch(e => {
            console.log("rename==>", e);
        })
        // 将头像地址存入数据库
        if (nextStep) {
            // 获取头像相对地址
            let avatarPath = newPath.split('static')[1];
            // 
            await dbController.uploadAvatar(regInfo.id, avatarPath).then(v => {
                console.log(v);
            }).catch(e => {
                console.log(e);
            })
        }
     
    } else {            // 删除头像
        let oldPath;
        for (let i in ctx.request.files) {
            oldPath = ctx.request.files[i].path;
        }
        // 删除文件
        await common.delFile(oldPath).then(v => {
            console.log(v);
        }).catch(e => {
            console.log("delFile==>", e);
        })
    }

    ctx.response.body = {
        sta,
        msg
    }
})

// 获取全部用户信息
router.get('/getalluserinfo', tokenController.checkToken, async function (ctx, next) {
    let info = await dbController.findAllUser();
    ctx.body = {
        sta: 1,
        msg: info
    }
})

// 删除用户
router.post('/deluser', tokenController.checkToken, async function (ctx, next) {
    let id = ctx.request.body.id;

    console.log("id: ", id);
    
    let msg;
    try {
        await dbController.delUser(id);
        sta = 1;
        msg = '删除成功！';
    } catch (error) {
        sta = 0;
        msg = '删除失败！'
        console.log(error)
    }

    ctx.response.body = {
        sta,
        msg
    }
})

// 获取用户信息（需要token）
router.post("/getuserinfo", tokenController.checkToken, async function (ctx, next) {
    let username = ctx.request.body.username;

    let art_num, userid, avatar;
    await dbController.findUser(username).then(v => {
        avatar = v.avatar;
        userid = v._id;
    }).catch(e => {
        console.log(e)
    })
    // 获取发布文章数
    await dbController.one_articleNum(username).then(v => {
        art_num = v;
    }).catch(e => {
        console.log(e)
    })
    
    ctx.response.body = {
        art_num,
        username,
        userid,
        avatar,
    }
})

// 获取用户数据 （不需要token）
router.post('/getinfo', async function (ctx, next) {
    let username = ctx.request.body.username;

    let art_num, userid, avatar;
    await dbController.findUser(username).then(v => {
        avatar = v.avatar;
        userid = v._id;
    }).catch(e => {
        console.log(e);
    })
    // 获取发布文章数
    await dbController.one_articleNum(username).then(v => {
        art_num = v;
    }).catch(e => {
        console.log(e);
    })
    
    ctx.response.body = {
        art_num,
        username,
        userid,
        avatar,
    }
})

// 获取用户图片库
router.get("/getimage", async function (ctx, next) {
    let userid = ctx.query.userid;

    let all_path = path.join(__dirname, `../static/upload/${userid}`)
    let files = fs.readdirSync(all_path)
    let imglist = [];
    files.forEach(function (item, index) {
        let obj = {}
        obj.path = path.join(all_path, item).split('static')[1];
        obj.filename = item;          
        imglist.push(obj)
    })

    ctx.response.body = {
        imglist
    }
})

// 删除图片
router.get("/delimage", async function (ctx, next) {
    let img_path = ctx.query.img_path;

    let all_path = path.join(__dirname, `../static${img_path}`)
    
    let msg;
    await common.delFile(all_path).then(v => {
        msg = v;
    }).catch(e => {
        msg = e;
    })
    
    ctx.response.body = {
        msg
    }
    
})


// 更新头像配置
const confupdate = body({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 5 * 1024 * 1024,                                       // 限制字段的最大大小
        uploadDir: path.join(__dirname, `../static/upload/temp`),          // 上传的文件存储的路径 
        keepExtensions: true,                   //  保留原来的文件后缀
        onFileBegin: async (name, file) => {    // 文件上传前设置
            // 获取文件后缀名
            // const ext = common.getUploadFileExt(file.name)
            const ext = 'png';
            // 生成文件名
            file.name = `${name}.${ext}`
            // 文件最终要保存到的文件目录
            const dir = path.join(__dirname, `../static/upload/avatar`)
            // 重设置文件保存地址
            file.path = `${dir}/${file.name}`;
        }
    },
    onError: function (err) {
        console.log("upload err", err)
    }
})

// 更新头像
router.post("/updateavatar", confupdate, tokenController.checkToken, async function (ctx, next) {

    // log
    log.logger.info(`Blog: Updateavatar ,username: ${ctx.request.body.username}`)
    
    ctx.response.body = {
        sta: 1,
    }
})

// 更改密码
router.post("/updatepassword", tokenController.checkToken, async function (ctx, next) {

    let oldpassword = sha1(ctx.request.body.oldpassword);
    let newpassword = sha1(ctx.request.body.newpassword);
    let userid = ctx.request.body.userid;

    let msg, sta, nextStep;
    await dbController.getUserInfo(userid).then(v => {
        if (v.password != oldpassword) {
            nextStep = false;
            msg = '旧密码不正确';
        } else {
            nextStep = true;
        }
    }).catch(e => {
        console.log(e);
    })

    if (nextStep) {
        await dbController.updatePassword(userid, newpassword).then(v => {
            msg = v;
            sta = 1;
        }).catch(e => {
            console.log(e);
        })
    }

    // log
    log.logger.info(`Blog: Updatepassword ,userid: ${userid}, sta: ${sta}`)
    
    ctx.response.body = {
        msg,
        sta,
    }
    
})

// 更改用户名
router.post('/updateusername', tokenController.checkToken, async function (ctx, next) {
    
    let oldusername = ctx.request.body.oldusername;
    let newusername = ctx.request.body.newusername;

    let msg, sta, nextStep;
    // 查询用户名
    await dbController.findUser(newusername).then(v => {
        if (v) {
            sta = false;
            msg = '用户名已存在'
        } else {
            nextStep = true;
        }
    }).catch(e => {
        console.log(e);
    })

    // 修改
    if (nextStep) {
        await dbController.updateUsername(oldusername, newusername).then(v => {
            sta = v;
            if (sta) {
                msg = '修改成功'
            } else {
                msg = '修改失败'
            }
        }).catch(e => {
            console.log(e);
        })
    }

    // log
    log.logger.info(`Blog: Updateusername ,oldusername: ${oldusername}, newusername:${newusername}, sta:${sta} `)
    
    ctx.response.body = {
        sta,
        msg,
        newusername
    }
})

// 验证token
router.get("/checkToken", tokenController.checkToken, async function (ctx, next) {
    ctx.response.body= {
        msg: 'valid'
    }
})

module.exports = router