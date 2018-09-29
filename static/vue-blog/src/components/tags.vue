<template>
    <div ref="tag-wrap">
        <p class="total">目前共计 {{ tags_num }}个标签</p>
        <canvas :class="[ isHover ? 'ishover': '' ]" id="canvas" width="700px" height="300px"></canvas>

        <page-footer></page-footer>
    </div>
</template>

<script>
import footer from "./footer";
import WordCloud from "../../static/wordcloud2/wordcloud2.js";

export default {
    components: {
        "page-footer": footer,
    },
    data() {
        return {
            // 
            isHover: false,
            
            tagList: [],
            tags_num: 0,
            options: {
                "list": [],
                "gridSize": 16,
                "weightFactor": 18,
                "fontFamily": 'Microsoft YaHei, Times, serif',
                // "color": 'random-light',
                "color": "#555",
                "backgroundColor": '#fff',
                "rotateRatio": 0.3,
                "shape": "circle",
                "click": (item, dimension, event) => {
                    console.log(item);
                    this.$router.push(`/tagslist/${item[0]}`)
                },
                "hover": (item, dimension, event) => {
                    if (item) {
                        this.isHover = true;
                    } else {
                        this.isHover = false;
                    }
                }
            }
        }
    },
    created(){
        // 设置aside
        this.$store.commit("SET_ASIDE_NAV", ["", "概况"]);
        this.$store.commit("SET_ASIDE_NAV_INDEX", 1);
        this.$store.commit("TOGGLE_ASIDE_ACTIVE", "close");
        
        this.$ajax.getTags().then(response => {
            console.log(response);
            this.tagList = response.data.taglist;
            this.tags_num = response.data.taglist.length;
            this.options.list = this.format_taglist;
            WordCloud(canvas, this.options);
            
        }).catch(error => {
            console.log(error);
        })
    },
    mounted() {
        var canvas = document.getElementById('canvas');
        canvas.width = this.$refs['tag-wrap'].offsetWidth;
    },
    computed: {
        // 格式化taglist
        format_taglist() {
            let ret = [];
            for (let item of this.tagList) {
                let t = []
                t.push(item['tags'])
                t.push(item['num_of_tag'])
                ret.push(t)
            }
            return ret;
        }
    }
}
</script>

<style lang="scss" scoped>
.ishover{
    cursor:pointer;
}
.total{
    color: #555;
    font-size: 14px;
    text-align: center;
}
</style>

