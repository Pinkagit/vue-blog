import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import axios from '../axios'

// 引入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// pages && components
import home from "@/pages/home"
import article from "@/pages/article"
import editor from "@/pages/editor"
import person from "@/pages/person"
import register from "@/pages/register"

import content from "@/components/content"
import articleManage from "@/components/article_manage"
import personManage from "@/components/person_manage"
import tags from "@/components/tags"
import tagsList from "@/components/tags_list"
import search from "@/components/search"
import about from "@/components/about"

Vue.use(Router)

const app = new Vue()

const router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            component: home,
            children: [
                {
                    path: '',
                    component: content,
                    name: 'list'
                },
                {
                    path: '/article/:artid',
                    name: 'article',
                    component: article,
                },
                {
                    path: '/tags',
                    name: 'tags',
                    component: tags
                },
                {
                    path: '/tagslist/:tagname',
                    name: 'tagslist',
                    component: tagsList
                },
                {
                    path: '/search',
                    name: 'search',
                    component: search,
                },
                {
                    path: '/about',
                    name: 'about',
                    component: about,
                }
            ]
        },
        {
            path: '/person',
            name: 'pserson',
            component: person,
            redirect: '/articlemanage',
            children:[
                {
                    path: '/articlemanage',
                    component: articleManage,
                    name: 'articleManage'
                },
                {
                    path: '/personmanage',
                    component: personManage,
                    name: 'personmanage'
                }
            ]
        },
        {
            path: '/register',
            name: register,
            component: register,
        },
        {
            path: '/editor',
            name: 'editor',
            component: editor,
            meta: {
                requiresAuth: true              //该页面需要登入
            }
        }
    ]
})

router.beforeEach(async(to, from, next) => {
    // console.log("To", to);
    
    if (to.meta.requiresAuth) {
        await axios.checkToken().then(v => {
            console.log(v);
        }).catch(e => {
            console.log(e);
        })
        // 获取token
        let token = store.state.TOKEN;
        console.log("token:", token);
        if (token) {
            next()
        } else {
            app.$message.warning("你已退出登入！")
            next({
                path: '/'
            })
            /* next({
                path: '/',
                query: { redirect: to.fullPath }    // 将刚刚要去的路由path作为参数，方便登录成功后直接跳转到该路由
            }) */
        }
    } else {
        next();
    }
})

export default router