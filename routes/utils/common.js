const fs = require('fs')

// 获取文件名后缀
const getUploadFileExt = (name) => {
    let ext = name.split('.');
    return ext[ext.length - 1]
}

// 生成文件名
const setFileName = () => {
    const time = new Date().getTime();
    return time;
}

// 创建文件夹
const mkDir = (p) => {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p)
        console.log("创建用户文件夹成功！")
    }
}

// 删除文件
const delFile = (p) => {
    return new Promise((resolve, reject) => {
        fs.unlink(p, function (err) {
            if (err) {
                reject(err)
            }
            resolve("删除文件成功！")
        })
    })
}

// 文件重命名
const renameFile = (oldPath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                reject(err)
            }
            resolve("重命名成功！");
        })
    })
}

module.exports = {
    getUploadFileExt,
    setFileName,
    mkDir,
    delFile,
    renameFile,
}