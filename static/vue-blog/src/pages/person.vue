<template>
    <div class="container">
        <header>
            <div class="avatars">
                <img :src="avatarUrl" alt="">
            </div>
            <p class="username">{{ author }}</p>
        </header>
        <section>
            <nav>
                <router-link 
                @click.native="toggleTab(index)"
                :class="[activeIndex == index ? 'active': '']" 
                v-for="(item, index) in navList" 
                :key="index"
                :to="item.topath">
                    <i :class="[item.class, 'iconfont']"></i>
                    {{ item.title }} 
                    <span v-if="index == 0">{{ artNum }}</span>
                </router-link>
            </nav>
            <transition
            mode="out-in"
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutRight"
            >
                <router-view 
                @update-info="getInfo"
                :userid="userid"
                ></router-view>
            </transition>
        </section>
        <i class="iconfont icon-fanhui4 btn-back" @click="toBack"></i>
    </div>
</template>

<script>
export default {
    data() {
        return {
            author:'',
            navList: [
                { 
                    topath: { 
                        name: "articleManage", 
                        query: { 
                            author: this.$route.query.author 
                        } 
                    }, 
                    class: 'icon-wenzhangliebiaoxiangqing', 
                    title: '文章' 
                },
                { 
                    topath: { 
                        name: "personmanage", 
                        query: { 
                            author: this.$route.query.author 
                        } 
                    }, 
                    class: 'icon-yonghuzhuzhanghaoguanli',
                    title: '账号' 
                }
            ],
            activeIndex: 0,
            avatarUrl: '',
            artNum: 0,
            userid: '',
        }
    },
    created(){
        let token = this.$store.state.TOKEN;
        this.author = this.$route.query.author;
        let name = this.$store.state.USERNAME;

        // 根据 $route.name 确定 activeIndex
        this.navList.forEach((item, index) => {
            if (item.topath.name == this.$route.name) {
                this.activeIndex = index;
            }
        })
        
        // 判断是否是本人的person页
        if (this.author != name || !token) {
            this.navList.splice(1, 1)
        }
        
        this.getInfo();
    },
    methods: {
        toggleTab(index) {
            this.activeIndex = index;
        },
        toBack(){
            this.$router.push('/');
        },
        getInfo() {
            // 获取基本信息
            this.$ajax.getInfo({ username: this.author }).then(response => {
                console.log("getInfo==>", response);

                this.avatarUrl = response.data.avatar;
                this.artNum = response.data.art_num;
                this.userid = response.data.userid;
                
            }).catch(error => {
                console.log(error)
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.container{
    margin: 50px auto;
    width: 800px;
}
header{
    overflow: hidden;
}
.avatars{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    text-align: center;
    float: left;
    overflow: hidden;
    border: 1px solid #eee;
    img{
        width: 100%;
        height: 100%;
    }
}
.username{
    float: left;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 21px;
    font-weight: 700;
    color: #333;
    margin-left: 10px;
}
nav{
    margin-top:15px;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #f0f0f0;
    a{
        margin-top: 1px;
        display: inline-block;
        height: 100%;
        box-sizing: border-box;
        line-height: 50px;
        text-align: center;
        padding: 0 20px;
        font-size: 17px;
        font-weight: 700;
        color: #969696;
        transition: all .2s ease-in-out;
        &:hover{
            border-bottom: 2px solid #646464;
        }
    }
    .active{
        border-bottom: 2px solid #646464;
        color: #646464;
    }
}
.iconfont{
    font-size: 20px;
}
.btn-back{
    position: fixed;
    bottom: 100px;
    left: 10%;
    color: #555;
    font-size: 28px;
    cursor:pointer;
}
</style>

