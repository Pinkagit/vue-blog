<template>
    <div class="box-container">
        <div class="box-wrap">
            <div class="box" ref="box" :style="{ float: align }">
                <canvas v-show="sel_canvas" width="200" height="200" ref="avaCanvas"></canvas>
                <img v-show="!sel_canvas&&avatar.url" :src="avatar.url" :style="avatar.img" alt="avatar">
            </div>
        </div>
        <div class="btn-wrap" :style="{ float: align }">
            <el-button @click="wrapOpen">{{ btnMsg }}</el-button>
        </div>
        <!-- cropper -->
        <div class="cropper-wrap" v-show="isShow_cropper">
            <span class="btn-close" @click="wrapClose"><i class="iconfont icon-guanbi1"></i></span>
            <div class="cropper-box">
                <vueCropper
                    ref="cropper"
                    :img="cropper_config.img"
                    :autoCrop="cropper_config.autoCrop"
                    :autoCropWidth="cropper_config.autoCropWidth"
                    :autoCropHeight="cropper_config.autoCropHeight"
                    :outputType="cropper_config.outputType"
                    :fixed="cropper_config.fixed"
                    :fixedBox="cropper_config.fixedBox"
                    :centerBox="cropper_config.centerBox"
                    @realTime="realTime"
                ></vueCropper>
            </div>
            <div class="pre-box">
                <div class="pre-avatar">
                    <img :src="previews.url" :style="previews.img" alt="">
                </div>
                <div class="btn-box">
                    <el-upload
                        ref="upload"
                        class="btn-upload"
                        action=""
                        :before-upload="handleUpload"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :file-list="fileList"
                        :show-file-list="false"
                        :multiple="false"
                        :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="certain">确定</el-button>
                    </el-upload>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import vueCropper from "vue-cropper";

export default {
    props: {
        avatarName: String,
        isReader: Boolean,
        align: String,
        selCanvas: {
            type: Boolean,
            default: true,
        },
        btnMsg: {
            type: String,
            default: "上传图片"
        },
    },
    components: {
        vueCropper,
    },
    data() {
        return{
            // 上传配置
            sel_canvas: true,       // 默认使用canvas
            
            fileList: [],
            fileType: ['image/jpeg', 'image/gif', 'image/png', 'image/jpg', 'image/bmp'],
            fileName: '',
            // 图片裁剪配置
            isShow_cropper: false,
            previews: {},
            avatar: {},
            cropper_config: {
                img: '',
				autoCrop: true,
				autoCropWidth: 200,
                autoCropHeight: 200,
                fixed: true,
                fixedBox: true,
                outputType: 'png',
                centerBox: false,        // 截图框被限制在图片里
            },
            // 
        }
    },
    created() {
        // 父组件传值
        this.sel_canvas = this.selCanvas;
    },
    watch: {
        avatarName(newValue){
            let canvas = this.$refs.avaCanvas;
            if (!canvas.getContext) {
                console.log("浏览器不支持canvas");
                return;
            }

            let ctx = canvas.getContext("2d");
            // 清除画布
            ctx.clearRect(0, 0, 200, 200)
            // 画布填充背景色
            ctx.fillStyle="#fff";
            ctx.fillRect(0,0,200,200);
            // 绘制文字
            ctx.font = "28px Microsoft YaHei";
            ctx.fillStyle = "#555";
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.fillText(newValue.slice(0, 5), 100, 100);
        },
        isReader(newValue, oldValue) {
            // 使用canvas
            if (this.sel_canvas) {
                let canvas = this.$refs.avaCanvas;
                let dataurl = canvas.toDataURL('image/png');
                this.fileName = new Date().getTime() + '.png';
                // dataurl 转 file
                let fileData = this.datatoFile(dataurl)
                // console.log("canvasFile:", fileData);
                // 判断文件大小
                if (fileData.size > 5 * 1024 * 1024) {
                    this.$message.warning("上传图片过大！");
                    return;
                }
                // 触发自定义事件
                this.$emit('push-filedata', fileData);
                
            } else {
                // 使用本地上传图片
                this.$refs.cropper.getCropData((data) => {          // 有bug,无数据时会停住
                    // base64 转 file
                    let fileData = this.datatoFile(data)
                    // console.log("uploadFile:", fileData);
                    // 判断文件大小
                    if (fileData.size > 5 * 1024 * 1024) {
                        this.$message.warning("上传图片过大！");
                        return;
                    }
                    // 触发自定义事件
                    this.$emit('push-filedata', fileData);
                })
            }
        }
    },
    methods: {
        /* dataurl & base64 转 file */
        datatoFile(dataurl) {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]), n = bstr.length;
            let u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], this.fileName, {type:mime});
        },
        /* copper层 */
        wrapOpen() {
            this.isShow_cropper = true;
        },
        wrapClose() {
            this.isShow_cropper = false;
        },
        certain() {
            this.avatar = this.previews;
            this.isShow_cropper = false;
            this.sel_canvas = false;
        },
        /* copper 实时数据 */
        realTime(data){
            this.previews = data;
        },
        /* 上传钩子 */
        handleUpload(file){                                     // 上传文件之前
            console.log("handleUpload:",file);
        },
        handleSuccess(response, file, fileList){                // 文件上传成功时
            console.log("handleSuccess:", response, file, fileList);
        },
        handleRemove(file, fileList) {                          // 文件列表中移除文件时
            console.log("handleRemove:", file, fileList);
            this.cropper_config.img = "";
            // 清除截图区
            this.$refs.cropper.clearCrop();                               
        },
        handleChange(file, fileList) {                          // 文件状态改变时（添加、上传成功、上传失败）
            console.log("handleChange:", file, fileList);       

            this.fileName = file.name;
            
            const isImg = this.fileType.indexOf(file.raw.type);
            if (isImg == -1) {
                this.$message.error('请上传图片！');
                return false;
            }
            
            let self = this;
            let reader = new FileReader();

            reader.readAsDataURL(file.raw);
            reader.onload = function () {
                //读取完成后，数据保存在对象的result属性中
                // console.log(this.result);
                self.cropper_config.img = this.result;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.box-container{
    overflow: hidden;
}
.box-wrap{
    overflow: hidden;
    .box{
        width: 200px;
        height: 200px;
        border-radius: 50%;
        float: right;
        border: 1px solid #888;
        line-height: 200px;
        text-align: center;
        overflow: hidden;
    }
}
.btn-wrap{
    width: 200px;
    margin-top: 20px;
    float: right;
    text-align: center;
    .el-button{
        width: 100%;
    }
}
// cropper
.cropper-wrap{
    width: 700px;
    height: 400px;
    background: #fff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    border: 1px solid rgba(0, 0, 0, .15);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding: 15px;
    .btn-close{
        display: block;
        width: 37px;
        height: 37px;
        cursor:pointer;
        line-height: 37px;
        text-align: center;
        position: absolute;
        right: 0px;
        top: 0;
        .iconfont{
            font-size: 23px;
        }
    }
    .cropper-box{
        width: 50%;
        height: 100%;
        float: left;
    }
    .pre-box{
        width: 50%;
        height: 100%;
        float: left;
        .pre-avatar{
            width: 200px;
            height: 200px;
            margin: 30px auto 50px;
            border: 1px solid #eee;
            border-radius: 50%;
            overflow: hidden;
        }
        .btn-box{
            width: 100%;
            height: 40px;
            .btn-upload{
                text-align: center;
            }
        }
    }
}
</style>

