<template>
    <div class="container">
        <aside>
            <div class="btn-back"><a href="javascript:void(0);" @click="toBack">返回</a></div>
            <div class="btn-back"><a href="javascript:void(0);" @click="toHome">回首页</a></div>
            <ul class="nav"> 
                <li v-for="(item, index) in navList" :key="index" @click="toggleNav(index)" :class="[index == navFlag ? 'navActive' : '']">
                    <span>{{ item }}</span>
                </li>
            </ul>
            <div class="btn-oper" @click="save"><a href="javascript:void(0);">保存</a></div>
            <div class="btn-oper" @click="submit"><a href="javascript:void(0);">发布</a></div>
        </aside>
        <!-- control -->
        <section class="control">
            <div class="label">
                标题
            </div>
            <div class="title-wrap">
                <el-input v-model="title"></el-input>
            </div>
            <div class="label">
                标签
            </div>
            <div class="tag-wrap">
                <el-tag
                :key="tag"
                class="item-tag"
                v-for="tag in dynamicTags"
                type="warning"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
                </el-tag>

                <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small"
                type="warning" @click="showInput">+ New Tag</el-button>
            </div>
            <div class="label">
                引言
                ({{ intr_num }})
            </div>
            <div class="editor-wrap">
                <el-input
                type="textarea"
                :autosize="{ minRows: 5 }"
                placeholder="字数在300以内..."
                v-model="introduction">
                </el-input> 
            </div>
            <div class="label" v-if="draftisShow">
                草稿列表
            </div>
            <div class="draft-wrap" v-if="draftisShow">
                <ul>
                    <li 
                    v-for="(item, index) in draftList" 
                    :key="index" 
                    :class="[drafFlag==index ? 'active' : '']"
                    @click="toggle_draft(index, item.id)"> 
                        <i class="iconfont icon-wenjian1"></i> 
                        {{ item.title }}
                        <i class="iconfont icon-guanbi1" @click.stop="deletDraft(index, item.id)"></i>
                    </li>
                </ul>
            </div>
        </section>
        <!-- editor content -->
        <section class="content">
            <editor
            :config         = "edConfig"
            v-model         = "ed_content"
            @on-ready       = "onEditorReady"
            @on-destroy     = "onDestory"
            :by-value        = "byvalue"
            ></editor>
        </section>
    </div>
</template>

<script>
import editor from "../components/editor";

export default {
    components: {
        'editor': editor
    },
    data() {
        return {
            navFlag: 0,
            navList: ["文章", "草稿"],
            drafFlag: -1,
            draftList: [],
            draftisShow: false,

            // 标签设置
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',

            // editor config
            edConfig: {
                height: "90vh"
            },
            // 通过该值的改变来通知子组件是否传值
            byvalue: 0,

            //info
            title: '',
            introduction: '',
            ed_content: '',
            id: '0',

            // 判断是否修改已发表的文章
            publish_change: false,
        }
    },
    created() {
        let msg = this.$route.params.msg
        if (this.$route.params.msg) {
            this.id = msg._id;
            this.title = msg.title;
            this.dynamicTags = msg.tags;
            this.introduction = msg.introduction;
            this.ed_content = msg.content;
            //
            this.publish_change = true; 
        }
    },
    methods: {
        toBack() {
            this.$router.go(-1);
        },
        toHome() {
            this.$router.push('/')
        },
        toggleNav(index) {
            this.navFlag = index;

             // 重置
            this.title = "";
            this.introduction = "";
            this.ed_content = "";
            this.byvalue = !this.byvalue;
            this.id = 0;
            this.dynamicTags = [];

            // 请求草稿列表
            if (index == 1) {
                this.draftisShow = true;

                this.$ajax.getDraftList({ name: this.$store.state.USERNAME }).then(response => {
                    console.log(response)
                    this.draftList = response.data.draftList;
                }).catch(error => {
                    console.log(error)
                })
            } else {
                this.draftisShow = false;
            }
        },

        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        save() {
            let article = {
                id: this.id,
                author: this.$store.state.USERNAME,
                title: this.title || '未命名',
                tags: this.dynamicTags,
                introduction: this.introduction,
                content: this.ed_content,
                create_time: new Date().getTime(),
                ispublish: false,
                publish_change: this.publish_change,
            }
            console.log("article:", article);

            this.$ajax.upload_article(article).then(response => {
                console.log(response)
                if (response.data.sta === 1) {
                    this.id = response.data.id;
                    this.$message.success("保存成功！");
                } else {
                    this.$message.error("保存失败！")
                }
               
            }).catch(error => {
                console.log(error);
            })
        },
        submit() {
            let article = {
                id: this.id,
                author: this.$store.state.USERNAME,
                title: this.title || '未命名',
                tags: this.dynamicTags,
                introduction: this.introduction,
                content: this.ed_content,
                create_time: new Date().getTime(),
                ispublish: true,
                publish_change: this.publish_change
            }

            this.$ajax.upload_article(article).then(response => {
                console.log(response)
                if (response.data.sta === 1) {
                    this.$message.success(response.data.msg)
                    // 重置
                    this.title = "";
                    this.introduction = "";
                    this.ed_content = "";
                    this.byvalue = !this.byvalue;
                    this.id = 0;
                    this.dynamicTags = [];

                    this.draftList.splice(this.drafFlag, 1);
                    
                } else {
                    this.$message.error(response.data.msg)
                }
            }).catch(error => {
                console.log(error);
            })
        },
        toggle_draft(index, id) {
            this.drafFlag = index;
            
            let artid = {
                artid: id
            }
            this.$ajax.readMore(artid).then(response => {
                console.log(response)
                this.title = response.data.msg.title;
                this.introduction = response.data.msg.introduction;
                this.dynamicTags = response.data.msg.tags;
                this.ed_content = response.data.msg.content;
                this.id = response.data.msg._id;

                this.byvalue = !this.byvalue;
            }).catch(error => {
                console.log(error)
            })
        },
        deletDraft(index, id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log("!", id);
                
                this.$ajax.deleteArticle(id).then(response => {
                    console.log(response);
                    if (response.data.sta == 1) {
                        this.draftList.splice(index, 1);
                        // 重置
                        this.title = "";
                        this.introduction = "";
                        this.ed_content = "";
                        this.byvalue = !this.byvalue;
                        this.id = 0;
                        this.dynamicTags = [];
                        
                        this.$message({
                            type: 'success',
                            message: response.data.msg
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: response.data.msg
                        });
                    }
                    
                }).catch(error => {
                    console.log(error);
                    this.$message({
                        type: 'error',
                        message: error
                    });
                })
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // editor的生命周期
        onEditorReady() {
            console.log("onEditorReady...")
        },
        onDestory(){
            console.log("onDestory...");
        }
    },
    computed:{
        intr_num() {
            return this.introduction.length;
        }
    },
}
</script>

<style lang="scss" scoped>
ul{
    margin: 0;
    padding: 0;
    list-style: none;
}
.container{
    display: flex;
    flex-direction: row;
    aside{
        height: 100vh;
        flex: 2;
        background: #404040;
        .btn-back{
            width: 70%;
            border: 1px solid rgba(236,114,89,.8);
            border-radius: 20px;
            text-align: center;
            margin: 30px auto;
            padding: 3px 5px;
            a{
                display: block;
                width: 100%;
                height: 100%;
                color: #ec7259;
            }
            &:hover{
                background: rgba(236,114,89,.8);
                a{
                    color: #fff;
                }
            }
        }
        .btn-oper{
            @extend .btn-back;
            position: relative;
            bottom: -500px;
        }
        .nav{
            width: 100%;
            overflow: hidden;
            li{
                width: 100%;
                box-sizing: border-box;
                height: 40px;
                color: #f2f2f2;
                text-align: center;
                transition: padding .2s;
                padding: 0 15px;
                cursor: pointer;
                &:hover{
                    background: #666;
                }
            }
            .navActive{
                border-left: 3px solid #ec7259;
                background: #666;
                padding-left: 12px;
            }
        }
    }
    section{
        height: 100vh;
    }
    .control{
        flex:3;
        border-right: 1px solid #A8A8A8;
        overflow: hidden;
        .label{
            width: 100%;
            height: 50px;
            background: #E6E6E6;
            line-height: 50px;
            font-size: 18px;
            color: #333;
            text-indent: 2em;
        }
        .tag-wrap{
            padding: 10px;
            .el-tag + .el-tag {
                margin-left: 10px;
            }
            .el-tag{
                margin-bottom: 10px;
            }
            .button-new-tag {
                margin-left: 10px;
                height: 32px;
                line-height: 30px;
                padding-top: 0;
                padding-bottom: 0;
            }
            .input-new-tag {
                width: 90px;
                margin-left: 10px;
                vertical-align: middle;
            }
        }
        .draft-wrap{
            ul{
                width: 100%;
                li{
                    height: 45px;
                    line-height: 45px;
                    background: #eee;
                    color: #333;
                    cursor: pointer;
                    text-indent: 1em;
                    box-shadow: border-box;
                    border-left: 3px solid transparent;
                    border-bottom: 1px solid rgb(185, 185, 185);
                    transition: background .3s;
                    .icon-wenjian1{
                        font-size: 20px;
                        margin-right: 15px;
                    }
                    .icon-guanbi1{
                        font-size: 15px;
                        float: right;
                        margin-right: 15px;
                    }
                    &:hover{
                        background: rgba(192, 196, 204, .5)
                    }
                }
                .active{
                    border-left-color: #ec7259;
                }
            }
        }
    }
    .content{
        flex:7;
        overflow: hidden;
        
    }
}

</style>