<template>
    <div>
        <ul class="wrap">
            <li v-for="(item, index) in articleList" :key="index">
                <p class="time">发表于 {{ item.create_time }}</p>
                <p class="titag_container">
                    <span class="title" @click="toRead(item.id)">{{ item.title }}</span>
                    <span class="tag" v-for="(tag, index) in item.tags" :key="index">
                        {{ tag }}
                    </span>
                </p>
                <p class="content" v-html="item.introduction">
                </p>
                <i class="iconfont icon-zhanghaoguanli" v-if="isShow" @click.stop="showTab(index)">
                    <div class="tab" v-show="index == tabShow_index">
                        <p class="modify" @click="modify(item.id)">修改</p>
                        <p @click="del(item.id, index)">删除</p>
                        <p @click="moveToDrafts(item.id, index)">移入草稿箱</p>
                    </div>
                </i>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            articleList: [],
            tabShow_index: -1,
            isShow: false,
        }
    },
    created() {
        let token = this.$store.state.TOKEN;
        let name = this.$store.state.USERNAME;
        let author = this.$route.query.author;
        // 验证状态
        if (token && name == author) {
            this.isShow = true
        }
        
        this.$ajax.getPersonArticle(author).then(response => {
            console.log(response);
            this.articleList = response.data.articleList;
            
        }).catch(error => {
            console.log(error);
        })
    },
    mounted() {
        document.addEventListener('click', this.handleBodyClick)
    },
    destroyed() {
        document.removeEventListener('click', this.handleBodyClick)
    },
    methods: {
        handleBodyClick(){
            this.tabShow_index = -1;
        },
        showTab(index) {
            this.tabShow_index = index;
        },
        modify(artid) {
            console.log({artid});
            this.$ajax.readMore({artid}).then(response => {
                console.log(response);

                this.$router.push({
                    path: '/editor',
                    name: 'editor',
                    params: {
                        msg: response.data.msg
                    }
                })
                
            }).catch(error => {
                console.log(error);
            })
        },
        del(artid, index) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.deleteArticle(artid).then(response => {
                    console.log(response);
                    if (response.data.sta == 1) {

                        this.articleList.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: response.data.msg
                        });

                        this.$emit('update-info')
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.msg
                        });
                    }
                }).catch(error => {
                    console.log(error);
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        moveToDrafts(artid, index) {
            this.$ajax.movetoDrafts(artid).then(response => {
                console.log(response);

                if (response.data.sta == 1) {
                    this.articleList.splice(index, 1);
                    this.$message.success(response.data.msg)

                    this.$emit('update-info')
                } else {
                    this.$message.error(response.data.msg)
                }
                
            }).catch(error => {
                console.log(error);
            })
        },
        toRead(artid) {
            this.$router.push(`/article/${artid}`);
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    list-style: none;
    padding: 0;
    margin: 0;
    color: #999;
    li{
        width: 100%;
        border-bottom: 1px solid #f0f0f0;
        padding: 20px 0;
        position: relative;
        .time{
            font-size: 13px;
        }
        .titag_container{
            width: 80%;
            @media screen and (max-width: 700px) {
                width: 100%;
            }
            .title{
                display: inline-block;
                max-width: 62.5%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #969696;
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                vertical-align: middle;
                transition: color .3s;
                &:hover{
                    color: #555;
                }
                @media screen and (max-width: 700px) {
                    max-width: 100%;
                }
            }
            .tag{
                display: inline-block;
                border:1px solid #E2777A;
                font-size: 14px;
                height: 21px;
                line-height: 21px;
                font-weight: normal;
                padding: 0px 5px;
                vertical-align: middle;
                border-radius: 5px;
                color: #E2777A;
                &:nth-of-type(2) {
                    margin-left: 15px;
                }
                &:not(:last-child) {
                    margin-right: 5px;
                }
            }
        }   
        .content{
            width: 80%;
            color: #999;
            font-size: 13px;
            @media screen and (max-width: 700px) {
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
        }
        
        .icon-zhanghaoguanli{
            font-size: 28px;
            position: absolute;
            cursor: pointer;
            right: 0;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .tab{
            position: absolute;
            top: 50%;
            right: -330%;
            box-sizing: border-box;
            width: 100px;
            border: 1px solid #999;
            background: #fff;
            font-size: 15px;
            border-radius: 5px;
            box-shadow: 3px 5px 12px rgba(0, 0, 0, .175);
            overflow: hidden;        
            @media screen and (max-width: 700px) {
                left: -330%;
                .modify {
                    display: none;
                }
            }    
            p{
                padding-left: 5px;
                &:not(:last-child) {
                    border-bottom: 1px solid #999;
                }
                &:hover{
                    background: #adadad;
                    color: #fff;
                }
            }
        }
    }
}
</style>
