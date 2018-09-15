const mongoose = require('mongoose');
const User = require('./db').User;
const Article = require('./db').Article;

const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp')

// 用户注册
const Register = async(ctx) => {
    let userDoc = new User({
        username: ctx.username,
        password: ctx.password,
        token: ctx.token,
        avatar: '',
    })

    // 将objectid转换为用户创建时间
    userDoc.create_time = moment(objectIdToTimestamp(userDoc._id)).format('YYYY-MM-DD HH:mm:ss');
    
    let regInfo = {
        registered: '',
        id: '',
    }

    try {
        let reply = await findUser(userDoc.username)

        if (reply) {
            regInfo.id = reply._id;
            regInfo.registered = 0;
        } else {
            await new Promise((resolve, reject) => {
                userDoc.save((err, rep) => {
                    if (err) {
                        reject(err)
                    }
                    regInfo.id = rep._id;
                    regInfo.registered = 1;
                    resolve()
                })
            })
        }
    } catch (error) {
        console.log(error);
    }

    return regInfo;
}

// 查找用户(通过username)
const findUser = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username }, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 获取用户信息(通过_id)
const getUserInfo = (id) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id);
        User.findOne({ _id }, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 查询所有用户信息
const findAllUser = () => {
    return new Promise((resolve, reject) => {
        User.find({}, (err, doc) => {
            if (err) {
                reject(err)
            } 
            resolve(doc)
        })
    })
}

// 删除用户
const delUser = (id) => {
    return new Promise((resolve, reject) => {
        User.findOneAndRemove({ _id: id }, (err, doc) => {
            if (err) {
                reject(err);
            }
            console.log("delete success!")
            resolve();
        })
    })
}

// 上传文章
const uploadArticle = (ctx) => {

    let articleDoc = new Article({
        author: ctx.author,
        title: ctx.title,
        introduction: ctx.introduction,
        content: ctx.content,
        tags: ctx.tags,
        create_time: ctx.create_time,
        ispublish: ctx.ispublish,
        catalog: ctx.catalog,
    })

    // 时间格式化
    articleDoc.create_time = moment(articleDoc.create_time).format('YYYY-MM-DD HH:mm:ss');
    
    return new Promise((resolve, reject) => {
        articleDoc.save((err, rep) => {
            if (err) {
                reject(err)
            }
            resolve(rep)
        })
    })
}

// 上传头像
const uploadAvatar = (id, path) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id);

        User.update({ _id }, { "$set": { "avatar": path } }).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve("头像保存成功！")
        })
        
    })
}

// 更改密码
const updatePassword = (id, password) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id);

        User.update({ _id }, { "$set": { "password": password } }).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve("修改成功！")
        })
    })
}

// 更改用户名
const updateUsername = async(oldusername, newusername) => {
   
    let sta = true;
    await new Promise((resolve, reject) => {
        // 修改 User 表
        User.update({ "username": oldusername }, { "$set": { "username": newusername } }).exec((err, doc) => {
            if (err) {
                sta = false;
                reject(err);
            }
            console.log("--------User表修改成功！");
            resolve();
        })
    })

    await new Promise((resolve, reject) => {
        // 修改 Article 表(批量)
        Article.update({ "author": oldusername }, { "$set": { "author": newusername } }, { multi: true, upsert: false }).exec((err, doc) => {
            if (err) {
                sta = false;
                reject(err);
            }
            console.log("------------ Article表修改成功！");
            resolve();
        })
    })

    return sta;
}

// 查看文章
const readArticle = (ctx) => {
    return new Promise((resolve, reject) => {
        
        let _id = mongoose.Types.ObjectId(ctx)

        Article.findOne({ _id }, (err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 查询文章
const serachArticle = (ctx) => {
    return new Promise((resolve, reject) => {
        Article.find({ $or: [{ content: { $regex: ctx, $options: "$i" } }, { tags: { $regex: ctx } }, { title: { $regex: ctx } }, { introduction: { $regex: ctx } }] }, { title: 1, author: 1, tags: 1, create_time: 1 }).sort({ create_time: -1 }).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 文章列表
const articleList = (ctx) => {
    return new Promise((resolve, reject) => {
        Article.find({ ispublish: true }).sort({ create_time: -1 }).skip(ctx.skip_num).limit(ctx.page_size).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        }) 
        
    })
}

// 草稿列表
const draftList = (name) => {
    return new Promise((resolve, reject) => {
        Article.find({ author: name, ispublish: false }).sort({ create_time: -1}).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}
 
// 文章总数
const articleNum = () => {
    return new Promise((resolve, reject) => {
        Article.find({ ispublish:true }).count().exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
} 

// 单用户的文章数
const one_articleNum = (name) => {
    return new Promise((resolve, reject) => {
        Article.find({ author: name, ispublish: true }).count().exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 单用户文章列表
const one_articleList = (name) => {
    return new Promise((resolve, reject) => {
        Article.find({ author: name, ispublish: true }).sort({ create_time: -1 }).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

// 修改文章
const update_articel = (id, ctx) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id)

        Article.update({ _id }, ctx).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve("更新成功！")
        })
    })
}

// 删除文章
const delete_article = (id) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id)

        Article.remove({ _id }).exec((err, doc) => {
            if (err) {
                reject(err)                
            }
            resolve("删除成功！")
        })
    })
}
// 文章移入到草稿箱
const moveto_drafts = (id) => {
    return new Promise((resolve, reject) => {
        let _id = mongoose.Types.ObjectId(id)
        
        Article.update({ _id }, { "$set": {"ispublish": false} }).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve("操作成功！")
        })
        
    })
}
// 获取tags
const get_tags = () => {
    return new Promise((resolve, reject) => {
        Article.aggregate([{ $unwind: "$tags" }, { $match: {ispublish: true } }, { $group: { _id: "$tags", num_of_tag: { $sum: 1 } } }, { $project: { _id: 0, tags: "$_id", num_of_tag: 1 } }, { $sort: { num_of_tag: -1 } }]).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}
// 查询tagslist
const get_tagsList = (name) => {
    return new Promise((resolve, reject) => {
        Article.aggregate([{ $unwind: "$tags" }, { $match: { tags: name, ispublish: true } }, { $project: { author: 1, title: 1, create_time: 1} }, { $sort: { create_time: -1 } }]).exec((err, doc) => {
            if (err) {
                reject(err)
            }
            resolve(doc)
        })
    })
}

module.exports = {
    Register,
    findUser,
    getUserInfo,
    findAllUser,
    delUser,
    uploadArticle,
    uploadAvatar,
    updatePassword,
    updateUsername,
    readArticle,
    serachArticle,
    articleList,
    articleNum,
    one_articleNum,
    one_articleList,
    update_articel,
    draftList,
    delete_article,
    moveto_drafts,
    get_tags,
    get_tagsList,
}