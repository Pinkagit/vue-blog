var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        },
        {
            type: "dateFile",//日志的输入类型，以日期命名的文件
            filename: 'logs/',//存放日志的目录，文件夹需要先手动创建
            pattern: 'log_yyyyMMdd',//输出的文件名格式为 log_20141113
            alwaysIncludePattern: true
            /* category: 'normal'*/ //这个不用设置，一旦设置，以后使用时就必须一致
        },
        {
            type: "dateFile",//日志的输入类型，以日期命名的文件
            filename: 'logs/',//存放日志的目录，文件夹需要先手动创建
            pattern: 'blog_yyyyMMdd',//输出的文件名格式为 log_20141113
            alwaysIncludePattern: true,
            category: 'Bloglog' //这个不用设置，一旦设置，以后使用时就必须一致
        }
    ],
    replaceConsole: true    //把console输出的内容也写入log文件
});

//输出方法供外部调用，name为上面配置里注射掉的category
// trace debug info warn error, fatal
exports.logger = log4js.getLogger("Bloglog");

