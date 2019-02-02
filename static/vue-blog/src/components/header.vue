<template>
    <header>
        <div class="title" id="top">
            我打我队友
        </div>
        <p class="subtitle">
            来不及了，快上车！
        </p>
        <nav>
            <ul>
                <li>
                    <router-link to="/">
                        <i class="iconfont icon-shouye2"></i>
                        <br>
                        首页
                    </router-link>
                </li>
                <li>
                    <router-link to="/tags">
                        <i class="iconfont icon-biaoqian"></i>
                        <br>
                        标签
                    </router-link>
                </li>
                <li>
                    <router-link to="/search">
                        <i class="iconfont icon-sousuo1"></i>
                        <br>
                        搜索
                    </router-link>
                </li>
                <li>
                    <router-link to="/about">
                        <i class="iconfont icon-iconguanyu"></i>
                        <br>
                        关于
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    data(){
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
header{
    width: 100%;
    height: 335px;
    box-sizing: border-box;
    padding: 100px 0 70px;
}
.title{
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 30px;
    color: #555;
}
.subtitle{
    height: 26px;
    margin: 10px 0 25px;
    text-align: center;
    color: #999;
    font-size: 14px;
}
nav{
    height: 53px;
    text-align: center;
    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        li{
            width: 28px;
            height: 100%;
            display: inline-block;
            margin: 0 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid transparent;
            transition: all .5s;
            &:hover{
                border-bottom-color: #222;
            }
            a{
                display: block;
                width: 100%;
                height: 100%;
                font-size: 13px;
                color: #555;
                word-wrap: break-word;
                .iconfont{
                    font-size: 17px;
                }
                &:hover {
                    color: #222;
                }
            }
        }
    }
}
</style>

