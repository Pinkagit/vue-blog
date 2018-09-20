import Vue from 'vue'
import axios from 'axios'
import store from './store'
import router from './router'

// 引入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

const app = new Vue()

// 创建axios实例
var ajax = axios.create({
    timeout: 10000,         // 10s超时
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
})

// 请求拦截
ajax.interceptors.request.use(
    // 请求发送前
    config => {
        // 如果TOKEN存在，每个http header都加上TOKEN
        if (store.state.TOKEN) {
            config.headers.Authorization = `token ${store.state.TOKEN}`
        }
        return config;
    }
)

// 响应拦截
ajax.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {

            console.log("fullPath:", router.currentRoute.fullPath);
            
            switch (error.response.status) {
                case 401:
                    store.commit('LOGOUT')      // 清除token
                    app.$message.warning("你已退出登入！");
                    break;
                    /* router.replace({
                        path: '/',
                        query: { redirect: router.currentRoute.fullPath }   // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    }) */
                default:
                    app.$message.error(error.response.statusText);
            }
        }
        
        return Promise.reject(error.response)
    }
)

export default {
    // 用户登入
    userLogin(params) {
        return ajax.post('/user/login', params)
    },
    // 用户注册
    userRegister(params) {
        return ajax.post('/user/register', params)
    },
    // 获取所有用户信息
    getAllUserInfo() {
        return ajax.get('/user/getalluserinfo')
    },
    // 获取用户信息
    getUserInfo(params) {
        return ajax.post('/user/getuserinfo', params)
    },
    // 获取用户信息（无需token）
    getInfo(params) {
        return ajax.post('/user/getinfo', params)
    },
    // 更新头像
    updateAvatar(params) {
        return ajax.post('/user/updateavatar', params)
    },
    // 更改密码
    updatePassword(params) {
        return ajax.post('/user/updatepassword', params)
    },
    // 更改用户名
    updateUsername(params) {
        return ajax.post('/user/updateusername', params);
    },
    // 删除用户
    delUser(params) {
        return ajax.post('/user/deluser', params)
    },
    // 上传图片
    upload_file(params) {
        return ajax.post('/article/upload_file', params)
    },
    // 上传文章
    upload_article(params) {
        return ajax.post('/article/upload_article', params)
    },
    // 获取文章列表
    getArticleList(params) {
        return ajax.get('/article/getarticlelist', {params})
    },
    // 获取草稿列表
    getDraftList(params) {
        return ajax.get('/article/getdraftlist', {params})
    },
    // 查看全文
    readMore(params) {
        return ajax.get("/article/read_article", {params})
    },
    // 删除文章
    deleteArticle(params) {
        return ajax.post("/article/deletearticle", { artid: params })
    },
    // 查询文章
    searchArticle(params) {
        return ajax.get('/article/serachArt', { params: { querycontent: params } })
    },
    // 将文章移入草稿箱
    movetoDrafts(params){
        return ajax.get("/article/movetodrafts", { params: { artid: params } })
    },
    // 获取个人文章列表
    getPersonArticle(params) {
        return ajax.get("/article/getpersonarticle", {params: { name: params } })
    },
    // 获取tags
    getTags() {
        return ajax.get("/article/gettags")
    },
    // 获取tagslist
    getTagsList(params) {
        return ajax.get("/article/gettagslist", { params: { tagname: params } })
    },

    // 验证token
    checkToken() {
        return ajax.get("/user/checkToken")
    },


}