const router = require('koa-router')()
const common = require('./utils/common')
const tokenController = require('./utils/token')
const body = require('koa-body')
const path = require('path')
const dbController = require('../db/controller')
const moment = require('moment');

// 上传配置
const confupload = body({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 5 * 1024 * 1024,     // 限制字段的最大大小
        uploadDir: path.join(__dirname, `../static/upload/temp`),          // 上传的文件存储的路径 
        keepExtensions: true,  //  保留原来的文件后缀
        onFileBegin: async(name, file) => {  // 文件上传前设置

            // 获取文件后缀名
            const ext = common.getUploadFileExt(file.name)
            // 生成文件名
            const fileName = common.setFileName()
            // 设置文件名
            file.name = `${fileName}.${ext}`
            // 文件最终要保存到的文件目录
            const dir = path.join(__dirname, `../static/upload/${name}`)
            // 创建文件
            common.mkDir(dir)
            // 重设置文件保存地址
            file.path = `${dir}/${file.name}`;
        }
    },
    onError: function (err) {
        console.log("upload err", err)
    }
})

// 上传图片
router.post('/upload_file', confupload, async function (ctx, next) {
    
    let img_path;
    for (let i in ctx.request.files) {
        img_path = ctx.request.files[i].path;
    }
    img_path = img_path.split('static')[1]

    // 返回图片路径
    ctx.response.body = {
        img_path
    }
})
// 上传文章
router.post('/upload_article', async function (ctx, next) {
    let art = {
        id: ctx.request.body.id,
        author: ctx.request.body.author,
        title: ctx.request.body.title,
        introduction: ctx.request.body.introduction,
        content: ctx.request.body.content,
        tags: ctx.request.body.tags,
        create_time: ctx.request.body.create_time,
        ispublish: ctx.request.body.ispublish,
        catalog: [],
        publish_change: ctx.request.body.publish_change,
    }
    
    if (art.content) {
        // 抓取 h1-h6 标签
        let reg = /<h[1-6](\s*[^>]*)?>.*?<\/h[1-6]>/g;
        art.content = art.content.replace(reg, function (item) {
            
            // 给 h 标签添加类名
            let arr = item.split("");
            arr.splice(3, 0, " class='h_title' ")

            // 获取标签类别和内容
            let h_class = item[2];
            let h_label = item.match(/>(.+)</)[1]

            art.catalog.push({
                class: h_class,
                label: h_label
            })

            return arr.join("");
        })
    }

    let msg, sta, id;
    if (art.id == 0) {
        // 添加新文章
        console.log("新增文章-------------------------");
        
        await dbController.uploadArticle(art).then(response => {
            sta = 1;
            id = response._id;
            msg = "上传成功！"

        }).catch(err => {
            sta = 0;
            msg = err
            console.log("ERRRRRR", err)
        })
    } else {
        // 修改文章
        console.log("修改文章-------------------------");
        
        let old_article;
        await dbController.readArticle(art.id).then(v => {
            old_article = v;
        }).catch(e => {
            console.log(e)
        })
        // 修改
        old_article.title = art.title;
        old_article.introduction = art.introduction;
        old_article.content = art.content;
        old_article.tags = art.tags;
        old_article.ispublish = art.ispublish;

        if (!art.publish_change) {
            old_article.create_time = art.create_time;
        }
        await dbController.update_articel(art.id, old_article).then(v => {
            sta = 1;
            id = art.id;
            msg = v;
        }).catch(e => {
            sta = 0;
            id = art.id;
            msg = e;
            console.log(e);
        })
    }
    ctx.response.body = {
        sta,
        msg,
        id,
    }
})

// 查看文章
router.get('/read_article', async function (ctx, next) {
    
    let artid = ctx.query.artid;

    let msg;
    await dbController.readArticle(artid).then(v => {
        msg = v;
    }).catch(e => {
        console.log("E", e)
    })

    ctx.response.body = {
        msg,
    }
})

// 查看文章列表
router.get("/getarticlelist", async function (ctx, next) {
    
    let page_index = parseInt(ctx.query.page_index);
    let page_size = parseInt(ctx.query.page_size);
    let skip_num = (page_index - 1) * page_size;

    let msg = [];
    let arttotal;

    // 查询文章总数
    await dbController.articleNum().then(v => {
        arttotal = v;
    }).catch(e => {
        console.log(e)
    })
    
    await dbController.articleList({ skip_num, page_size}).then(v => {

        for(let i = 0, len = v.length; i < len; i++) {
            msg.push({
                id          : v[i]._id,
                author      : v[i].author,
                title       : v[i].title,
                create_time : moment(v[i].create_time).format("YYYY-MM-DD HH:mm:ss") ,
                tags        : v[i].tags,
                introduction: v[i].introduction,
            })
        }
    }).catch(e => {
        console.log(e)
    })
    
    ctx.response.body = {
        ret: {
            msg,
            arttotal
        }
    }
})

// 查询文章
router.get('/serachArt', async function (ctx, next) {
    let queryContent = ctx.query.querycontent;

    let artlist;
    await dbController.serachArticle(queryContent).then(v => {
        artlist = v
    }).catch(e => {
        console.log(e);
    })
    
    ctx.response.body = {
        artlist
    }
})

// 查看草稿列表
router.get("/getdraftlist", tokenController.checkToken, async function (ctx, next) {
    let name = ctx.query.name;
    let draftList = []

    await dbController.draftList(name).then(v => {
        for(let i = 0, len = v.length; i < len; i++) {
            draftList.push({
                id: v[i]._id,
                title: v[i].title,
            })
        }
        
    }).catch(e => {
        console.log(e)
    })
    
    ctx.response.body = {
        draftList
    }
})

// 获取个人文章列表
router.get("/getpersonarticle", async function (ctx, next) {

    let name = ctx.query.name;
    let articleList = [];
    
    await dbController.one_articleList(name).then(v => {

        for (let i = 0, len = v.length; i < len; i++) {
            articleList.push({
                id          : v[i]._id,
                title       : v[i].title,
                create_time : moment(v[i].create_time).format("YYYY-MM-DD HH:mm:ss"),
                tags        : v[i].tags,
                introduction: v[i].introduction,
            })
        }
    }).catch(e => {
        console.log(e);
    })
    
    ctx.response.body = {
        articleList
    }
})

// 删除文章
router.post('/deletearticle', tokenController.checkToken, async function (ctx, next) {
    let artid = ctx.request.body.artid;

    let msg, sta;
    await dbController.delete_article(artid).then(v => {
        sta = 1;
        msg = v;
    }).catch(e => {
        sta = 0;
        msg = e;
        console.log(e);
    })
    
    ctx.response.body = {
        sta,
        msg
    }
})

// 文章移入草稿箱
router.get('/movetodrafts', tokenController.checkToken, async function (ctx, next) {

    let artid = ctx.query.artid;

    let msg, sta;
    await dbController.moveto_drafts(artid).then(v => {
        console.log(v);
        sta = 1;
        msg = v;
    }).catch(e => {
        sta = 0;
        msg = e;
        console.log(e);
    })
    
    ctx.response.body = {
        sta,
        msg
    }
})

// 查询tags
router.get("/gettags", async function (ctx, next) {
    
    let taglist;
    await dbController.get_tags().then(v => {
        taglist = v
    }).catch(e => {
        console.log(e);
    })

    ctx.response.body = {
        taglist,
    }
})

// 获取tagslist
router.get("/gettagslist", async function (ctx, next) {
    let tagname = ctx.query.tagname;
    
    let tagslist;
    await dbController.get_tagsList(tagname).then(v => {
        tagslist = v;
    }).catch(e => {
        console.log(e);
    })
    
    ctx.response.body = {
        tagslist
    }
})

module.exports = router