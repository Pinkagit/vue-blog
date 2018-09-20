import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

const state = {
    TOKEN: window.sessionStorage.getItem('token') || window.localStorage.getItem('token'),
    USERNAME: window.sessionStorage.getItem('username') || window.localStorage.getItem('username'),
    USERID: window.localStorage.getItem("userid"),
    CURRENTPAGE: Number(window.sessionStorage.getItem('currentpage')) || 1, //当前页数
    ASIDE_ISACTIVED: 0, // aside 状态
    ASIDE_NAV: ["", "概况"],     // aside nav条目
    ASIDE_NAV_INDEX: 1, // aside nav 当前条目index
    CATALOG: [],        // 目录
    ARTTOTAL: window.sessionStorage.getItem('arttotal') || 0,        // 文章总数
    TAGSTOTAL: window.sessionStorage.getItem('tagstotal') || 0,       // 标签总数
}

const mutations = {
    // 用户登入
    LOGIN:(state, params) => {
        state.TOKEN = params;
        window.sessionStorage.setItem('token', params);
    },
    // 用户登出
    LOGOUT:(state, params) => {
        state.TOKEN = null;
        window.sessionStorage.removeItem('token');
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userid");
    },
    // 保存用户名
    SET_USERNAME:(state, params) => {
        state.USERNAME = params;
        window.sessionStorage.setItem('username', params);
    },
    // 保存用户id
    SET_USERID: (state, params) => {
        state.USERID = params;
        window.localStorage.setItem("userid", params);
    },
    // 保存文章总数
    SET_ARTTOTAL: (state, params) => {
        state.ARTTOTAL = params;
        window.sessionStorage.setItem('arttotal', params);
    },
    // 保存标签总数
    SET_TAGSTOTAL: (state, params) => {
        state.TAGSTOTAL = params;
        window.sessionStorage.setItem('tagstotal', params);
    },
    // 当前页数
    SET_CURPAGE:(state, params) => {
        state.CURRENTPAGE = params;
        window.sessionStorage.setItem('currentpage', params);
    },
    // aside 状态
    TOGGLE_ASIDE_ACTIVE:(state, params) => {
        
        if (params == 'open') {
            state.ASIDE_ISACTIVED = 1;
        } else if (params == 'close') {
            state.ASIDE_ISACTIVED = 0;
        } else {
            state.ASIDE_ISACTIVED = !state.ASIDE_ISACTIVED
        }
    },
    // 目录
    SET_CATALOG: (state, params) => {
        state.CATALOG =  params;
    },
    // asie nav条目
    SET_ASIDE_NAV: (state, params) => {
        state.ASIDE_NAV = params;
    },
    // aside nav 当前条目index
    SET_ASIDE_NAV_INDEX: (state, params) => {
        state.ASIDE_NAV_INDEX = params;
    },
}

const actions = {
    
}

export default new vuex.Store({
    state,
    mutations,
    actions
})