# vue-blog

>在线多人博客

# 技术栈 

前端：vue + vue-router + vuex + axios

后端：nodejs + koa2 + mongodb

# 项目结构
	|-- config      
    |-- db          
    |-- logs
    |-- routes           
	|-- static                           // 静态资源
	|   |-- static                          // build后资源文件
	|   |-- upload                          // 上传资源
	|   |-- vue-blog                        // 前端源码
    |   |-- index.html                      // build后资源文件
	|   
	|-- .gitignore                       
    |-- README.md
    |-- app.js
	|-- config.js  
    |-- log.js                   
	|-- package.json                     
    |-- run.py
	|-- yarn.lock                        

# 项目启动

1. 初始化项目

```bash
    $ npm install
    $ cd static/vue-blog
    $ npm install
```
 
2. 启动MongoDB
```
    $ mongod --dbpath XXX
```
3. 启动服务器
```javascript
    // xixi
    $ node app.js
```
4. 启动项目
```bash
    # static/vue-blog
    $ yarn start
```

# 组件

+ UI组件：<a href="http://element.eleme.io/#/zh-CN" target="_blank">element-ui</a>
+ 图片裁剪插件：<a href="https://github.com/xyxiao001/vue-cropper" target="_blank">vue-cropper</a>
+ 富文本编辑器：<a href="https://www.tiny.cloud/" target="_blank">TinyMCE</a>
+ 标签云： <a href="https://cran.r-project.org/web/packages/wordcloud2/vignettes/wordcloud.html" target="_blank">Wordcloud2</a>
