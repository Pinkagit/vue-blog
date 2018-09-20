<template>
    <div class="content">
        <section>
            <article v-for="(item, index) in articleList" :key="index">
                <h1 class="title"><a href="javascript:void(0);" @click="readmore(item.id)">{{ item.title }}</a></h1>
                <article-menu
                :create_time = "item.create_time"
                :author = "item.author"
                :tags = "item.tags"
                ></article-menu>
                <div v-html="item.introduction" class="introduction">
                </div>
                <span class="btn-readAll" @click="readmore(item.id)">阅读全文</span>
            </article>
        </section>
        <el-pagination
            @current-change="handleCurrentChange"
            class="page-tabs"
            background
            layout="prev, pager, next"
            :page-size="pageSize"         
            :current-page.sync="currentPage"
            :pager-count=5
            :total="artTotal">
        </el-pagination>
        <!-- 
            pager-count     : 页码按钮数量，当总页数超过该值时会折叠
            page-size       : 每页显示条目个数
            current-page    : 当前页数
            total           : 总条目数
         -->
        <page-footer></page-footer>
    </div>
</template>

<script>
import menu from "./article_menu";
import footer from "./footer";

export default {
    components: {
        "article-menu": menu,
        "page-footer": footer,
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 3,
            artTotal: 1,
            articleList: []
        }
    },
    created() {
        this.currentPage = this.$store.state.CURRENTPAGE;
        this.handleCurrentChange(this.currentPage);
        // 设置aside
        this.$store.commit("SET_ASIDE_NAV", ["", "概况"]);
        this.$store.commit("SET_ASIDE_NAV_INDEX", 1);
        this.$store.commit("TOGGLE_ASIDE_ACTIVE", "close");
    },
    methods: {
        readmore(id) {
            this.$router.push(`/article/${id}`);
        },
        handleCurrentChange(val) {
            let pageInfo = {
                page_index: val,
                page_size: this.pageSize,
            }

            this.$store.commit("SET_CURPAGE", val);

            this.$ajax.getArticleList(pageInfo).then(response => {
                console.log(response)
                this.articleList = response.data.ret.msg;
                this.artTotal = response.data.ret.arttotal;
                this.$store.commit("SET_ARTTOTAL", response.data.ret.arttotal);
                this.currentPage = val;           // artTotal 发生改变，会导致组件初始化，需要在此重新赋值

                // 当当前页码和实际页码数不等时，重新请求数据
                if (this.currentPage !== 1 && response.data.ret.msg.length == 0) {
                    this.$store.commit("SET_CURPAGE", this.currentPage-1);
                    this.handleCurrentChange(this.currentPage-1)
                }
                
                // 返回顶部
                var oTop = document.getElementById('top');
                oTop.scrollIntoView({ behavior: "smooth", block: "end"})
            }).catch(error => {
                console.log(error)
            })
        },
    },
    beforeRouteLeave(to, from, next) {
        // this.$store.commit("SET_CURPAGE", 1);
        next();
    }
     
}
</script>


<style lang="scss" scoped>
.content{
    width: 100%;
    height: auto;
    padding-top: 40px;
    transition: all 2s;
    section{
        min-height: 360px;
    }
}
article{
    width: 100%;
    height: auto;
}
article:not(:last-child) {
    margin-bottom: 60px;
    &::after{
        content: '';
        display: block;
        width: 55px;
        height: 1px;
        background: #ccc;
        margin: 0 auto;
    }
}
.title{
    text-align: center;
    word-break: break-word;
    a{
        display: inline-block;
        color: #555;
        font-size: 26px;
        line-height: 1.2;
        position: relative;
        &::after{
            content: '';
            // display: block;
            width: 100%;
            height: 1px;
            position: absolute;
            background: #000;
            left: 0;
            bottom: -3px;
            transform: scaleX(0);
            transition: all .3s ease-in-out;
        }
        &:hover{
            &::after{
                transform: scaleX(1);
            }
        }
    }
}

.btn-readAll{
    display: block;
    width: 100px;
    height: 28px;
    margin: 55px auto 80px;
    background: #222;
    color: #fff;
    border: 2px solid #222;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    &:hover{
        background: #fff;
        color: #222;
    }
}
.introduction{
    color: #555;
    font-size: 14px;
    text-indent: 2em;
}
.page-tabs{
    text-align: center;
    border-top: 1px solid #eee;
}

</style>

