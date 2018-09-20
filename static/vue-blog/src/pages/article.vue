<template>
    <div>
        <section class="article_content">
            <h1 class="title">{{ title }}</h1>
            <art-menu
            :create_time="create_time"
            :author="author"
            :tags="tags"
            >
            </art-menu>
            <art-content v-if="content" :child-content="content"></art-content>
            <art-footer></art-footer>
        </section>
    </div>
</template>

<script>
import moment from  "moment";

import artContent from "../components/article_content";
import menu from "../components/article_menu";
import footer from "../components/footer";

export default {
    components: {
        "art-content" : artContent,
        "art-menu": menu,
        "art-footer": footer,
    },
    data() {
        return{
            title: '',
            create_time: '',
            author: '',
            tags: [],
            content: '',
        }
    },
    created() {
        // 设置aside
        this.$store.commit("SET_ASIDE_NAV", ["目录", "概况"]);
        this.$store.commit("SET_ASIDE_NAV_INDEX", 0)
        this.$store.commit("TOGGLE_ASIDE_ACTIVE", "open")
        
        let artid = {
            artid: this.$route.params.artid
        }

        this.$ajax.readMore(artid).then(response => {
            this.title = response.data.msg.title;
            this.create_time = moment(response.data.msg.create_time).format("YYYY-MM-DD HH:mm:ss");
            this.author = response.data.msg.author;
            this.tags = response.data.msg.tags;
            this.content = response.data.msg.content;
            this.$store.commit('SET_CATALOG', response.data.msg.catalog);
            
        }).catch(error => {
            console.log(error)
        })
    }
}
</script>

<style lang="scss" scoped>
.article_content{
    color: #555;
    font-size: 14px;
    min-height: 633px;
    position: relative;
}
.title{
    font-size: 26px;
    text-align: center;
    word-break: break-word;
}
</style>
