<template>
    <div>
        <h2 class="tagname"><i class="iconfont icon-shuqianbookmark30"></i> {{ this.$route.params.tagname }} <span>分类 {{tagsLength}}</span></h2>
        <hr>
        <ul class="tagslist_container">
            <li v-for="(item, index) in tagsList" :key="index">
                <span class="time">{{ item.create_time }}</span>
                <span class="title" @click="toRead(item._id)">{{ item.title }}</span>
                <span class="author">{{ item.author }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import moment from "moment";

export default {
    data() {
        return {
            tagsList: [],
            tagsLength: 0,
        }
    },
    created() {
        // 设置aside
        this.$store.commit("SET_ASIDE_NAV", ["", "概况"]);
        this.$store.commit("SET_ASIDE_NAV_INDEX", 1);
        this.$store.commit("TOGGLE_ASIDE_ACTIVE", "close");
        // 
        this.$ajax.getTagsList(this.$route.params.tagname).then(response => {
            console.log(response);
            for(let item of response.data.tagslist ) {
                item.create_time = moment(item.create_time).format("YY-MM-DD");
            }
            this.tagsList = response.data.tagslist;
            this.tagsLength = response.data.tagslist.length;
            
        }).catch(error => {
            console.log(error);
        })
    },
    methods: {
        toRead(id) {
            this.$router.push(`/article/${id}`);
        }
    }
}
</script>

<style lang="scss" scoped>
.tagname{
    color: #555;
    .icon-shuqianbookmark30{
        font-size: 20px;
    }
    span{
        color: #bbb;
        font-size: 80%;
    }
}
.tagslist_container{
    margin: 0;
    padding-left: 20px;
    box-sizing: border-box;
    width: 100%;
    li{
        width: 100%;
        height: 50px;
        border-bottom: 1px dashed #ccc;
        line-height: 50px;
        color: #bbb;
        transition: all .2s ease-in-out;
        span{
            float: left;
        }
        .title{
            width: 60%;
            color: #666;
            height: 100%;
            font-size: 16px;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .author{
            float: right;
            font-size: 13px;
            color: #666;
            margin-right: 10px;
        }
        .time{
            float: left;
            font-size: 12px;
            margin-right: 10px;
            color: #666;
        }
        &:hover{
            border-bottom-color: #666;
            color: #666;
        }
    }
}
</style>
