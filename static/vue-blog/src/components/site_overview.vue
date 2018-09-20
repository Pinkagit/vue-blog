<template>
<div>
    <transition
        mode="out-in"    
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
    >
        <div class="container" key="site" v-if="!about_isShow">
            <div class="logo">
                <img src="../assets/img/logo.png" alt="logo">
            </div>
            <p class="title">
                贤隆团队博客
            </p>
            <div class="menu">
                <router-link class="meun-item" to="/">
                    <p class="item-num">{{ $store.state.ARTTOTAL }}</p>
                    <p class="item-name">文章</p>
                </router-link>
                <router-link  class="meun-item" to="/tags">
                    <p class="item-num">{{ $store.state.TAGSTOTAL }}</p>
                    <p class="item-name">标签</p>
                </router-link>
            </div>
            <div class="motion">
                <div class="btn-wrap" v-if="!loginModule_isShow">
                    <span class="btn-login"  @click="tologin">登入</span>
                </div>
                <transition
                enter-active-class="animated fadeInUp"
                leave-active-class="animated bounceOutRight"
                >
                    <el-form v-if="loginModule_isShow" ref="form" :model="loginData" label-width="0px">
                        <el-form-item label="">
                            <el-col :span="18" :offset="3">
                                <el-input v-model.trim="loginData.username" placeholder="username"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="">
                            <el-col :span="18" :offset="3">
                                <el-input type="password" v-model.trim="loginData.password" placeholder="password" @keyup.native.enter="login"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="11" :offset="2">
                                <el-checkbox v-model="isKeepLogin">保持登入状态</el-checkbox>
                            </el-col>
                        </el-form-item>

                        <div class="btn-wrap">
                            <span class="btn-login" @click="login">登入</span>
                            <span class="btn-toReg" @click="toReg">去注册</span>
                        </div>
                    </el-form>
                </transition>
            </div>
        </div>

        <div class="about" key="about" v-if="about_isShow">
            <div class="avatars">
                <img :src="avatarUrl" alt="">
            </div>
            <span class="username">{{ this.username }}</span>
            <div class="site-item">
                <a href="javascript:void(0);" @click="toPerson(username)">
                    <span class="item-num">{{ this.artnum }}</span>
                    <span class="item-name">文章</span>
                </a>
            </div>
            <div class="btn-wrap">
                <span class="btn-login" @click="toEditor">写文章</span>
                <span class="btn-login" @click="logout">退出</span>
            </div>
        </div>
    </transition>
</div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            isKeepLogin: false,
            loginData: {
                username: '',
                password: '',
            },
            loginModule_isShow: 0,
            about_isShow: 0,
            username: '',
            artnum: 0,
            avatarUrl: '',
        }
    },
    created() {
        // 检测登入状态，获取用户信息
        if (this.$store.state.TOKEN && this.$store.state.USERNAME) {
            this.getUserInfo(this.$store.state.USERNAME);
        }
        // 注册跳转后登入
        if (this.$route.params.username && this.$route.params.password) {
            this.loginData.username = this.$route.params.username;
            this.loginData.password = this.$route.params.password;
            this.login();
        }

        // 获取标签总数
        this.$ajax.getTags().then(response => {
            // 保存标签总数
            this.$store.commit("SET_TAGSTOTAL", response.data.taglist.length);
        }).catch(error => {
            console.log(error);
        })

    },
    methods: {
        getUserInfo(name) {
            this.$ajax.getUserInfo({ username: name }).then(response => {
                console.log("getUserInfo==>", response)
                if (response.data.username) {
                    this.about_isShow = 1;
                    this.username = response.data.username;
                    this.artnum = response.data.art_num;
                    this.avatarUrl = response.data.avatar;
                    this.$store.commit("SET_USERID", response.data.userid);
                }
            }).catch(error => {
                console.log(error)
            })
        },
        tologin(){
            this.loginModule_isShow = 1;
        },
        login() {
            console.log("loginData:", this.loginData);
            this.$ajax.userLogin(this.loginData).then(response => {
                console.log("loginData==>", response)
                
                if (response.data.sta === 0) {
                    this.$message.error(response.data.msg)
                    return;
                }
                this.$message.success(response.data.msg)
                this.$store.commit('LOGIN', response.data.token)
                this.$store.commit('SET_USERNAME', this.loginData.username)

                if (this.isKeepLogin) {
                    // 将token, username保存到 localStorage中
                    window.localStorage.setItem('token', response.data.token);
                    window.localStorage.setItem("username", this.loginData.username);
                } else {
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem('username');
                }
                
                this.getUserInfo(this.$store.state.USERNAME)

            }).catch(error => {
                console.log(error)
            })
        },
        toEditor() {
            this.$router.push('/editor')
        },
        logout() {
            this.$store.commit('LOGOUT')
            this.about_isShow = 0;
        },
        toPerson(author) {
            this.$router.push({
                path: '/person',
                query: { author }
            })
        },
        toReg(){
            this.$router.push("/register");
        }
    }
}
</script>

<style lang="scss" scoped>
.logo{
    width: 100%;
    height: 130px;
    overflow: hidden;
    margin-bottom: 10px;
    text-align: center;
    img{
        height: 100%;
    }
}
.title{
    text-align: center;
    color: #f5f5f5;
    font-size: 14px;
    margin-bottom: 20px;
    height: 28px;
    width: 100%;
    overflow: hidden;
}
.menu{
    width: 100%;
    height: 45px;
    overflow: hidden;
    text-align: center;
    // background: lightcoral;
    margin-bottom: 20px;
    .meun-item{
        display: inline-block;
        width: 45px;
        height: 100%;
        color: #999;
        line-height: 1.4;
        text-align: center;
        &:hover{
            color: #eee;
        }
        .item-num{
            font-size: 18px;
        }
        .item-name{
            font-size: 13px;
        }
        &:not(:last-child) {
            border-right: 1px solid #555;
        }
    }
}
.motion{
    width: 100%;
    text-align: center;
}
.btn-wrap{
    width: 100%;
    height: 32px;
    overflow: hidden;
}
.btn-login{
    border: 1px solid#fc6423;
    border-radius: 4px;
    padding: 3px 15px;
    color: #fc6423;
    font-size: 16px;
    cursor: pointer;
    &:hover{
        background: #fc6423;
        color: #fff;
    }
}
.btn-toReg{
    @extend .btn-login;
    margin-left: 8px;
}
.avatars{
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    background: #3d3d3d;
    img{
        width: 100%;
        height: 100%;
    }
}
.about{
    width: 100%;
    height: 273px;
    overflow: hidden;
    text-align: center;
    .username{
        font-size: 15px;
        color: #f5f5f5;
    }
    .site-item{
        margin: 25px 0 20px;
        line-height: 1.4;
        a{
            color: #999;
            &:hover{
                color: #fff;
            }
            span{
                display: block;
            }
        }
        .item-num{
            font-size: 18px;
        }
        .item-name{
            font-size: 13px;
        }
    }
    .btn-login:not(:last-child){
        margin-right: 5px;
    }
}
.el-checkbox{
    color: #eee;
}
</style>

