<template>
    <div>
        <div class="input-suffix">
            <el-autocomplete
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                popper-class='my-autocomplete'
                :fetch-suggestions="querySearchAsync"
                v-model.trim="searContent"
                @select="handleSelect"
                @keyup.enter.native="showList"
            >
                <template slot-scope="{ item }">
                    <span class="tip" v-show="item.isTip">{{ item.isTip }}</span>
                    <span class="suggestions-item title" v-show="!item.isTip">{{ item.title }}</span>
                    <span class="suggestions-item author" v-show="!item.isTip">{{ item.author }}</span>
                    <span class="suggestions-item time" v-show="!item.isTip" v-text="formTime(item.create_time)"></span>
                </template>
            </el-autocomplete>
        </div>

        <p class="list-title" v-show="isShow_list">
            查询文章 {{ listLength }} 篇
        </p>
        
        <ul class="list_container" v-show="isShow_list">
            <li v-for="(item, index) in restaurants" :key="index">
                <span class="time" v-text="formTime(item.create_time)"></span>
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
            searContent: '',
            restaurants: [],
            isShow_list: false,
            listLength: 0,
        }
    },
    created(){
        // 设置aside
        this.$store.commit("SET_ASIDE_NAV", ["", "概况"]);
        this.$store.commit("SET_ASIDE_NAV_INDEX", 1);
        this.$store.commit("TOGGLE_ASIDE_ACTIVE", "close");
    },
    methods: {
        formTime(time){
            return moment(time).format("YY-MM-DD");
        },
        querySearchAsync(queryString, cb) {
            console.log("queryString=>", queryString);
            
            
            if (queryString == 0 || queryString == undefined) {
                cb([
                    { isTip: '查询内容（标题、标签、文章内容）' }
                ])
                return;
            }
            
            this.$ajax.searchArticle(queryString).then(response => {
                console.log(response);
                this.restaurants = response.data.artlist;
                this.listLength = response.data.artlist.length;
                // 调用 callback 返回建议列表的数据
                cb(response.data.artlist)
            }).catch(error => {
                console.log(error);
            })
        },
        handleSelect(item) {
            console.log("handleSelect==>", item);
            this.searContent = item.title;
            this.$router.push(`/article/${item._id}`);
        },
        showList(){
            this.isShow_list = true; 
        },
        toRead(id) {
            this.$router.push(`/article/${id}`);
        }
    },
}
</script>

<style lang="scss" scoped>
.list-title{
    margin: 40px 0 20px;
    text-align: center;
    color: #555;
    font-size: 14px;
}
.input-suffix{
    width: 500px;
    margin: 0 auto;
    .el-autocomplete{
        width: 100%;
    }
    
}
</style>

<style lang="scss">
.my-autocomplete{
    li{
        .title{
            float: left;
            font-size: 15px;
            max-width: 280px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
       .time{
           float:right;
           font-size: 12px;
           margin-right: 10px;
           color: #82848a;
       }
        .author{
            float: right;
            color: #555;
        }
    }
}

.list_container{
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
            width: 450px;
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
