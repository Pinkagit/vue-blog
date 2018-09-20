<template>
    <div class="container">
        <h2>账号信息</h2>
        <el-row>
            <el-col :span="10">
                <el-form ref="form" label-position="top" :model="regInfo" :rules="rules" label-width="80px">
                    <el-form-item label="用户名" prop="name">
                        <el-col :span="24">
                            <el-input v-model="regInfo.name"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-col :span="24">
                            <el-input type="password" v-model="regInfo.password"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="再次输入密码" prop="re_password">
                        <el-col :span="24">
                            <el-input type="password" v-model="regInfo.re_password"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button :loading="isLoading" @click="submit">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <el-col :span="10" :offset="4" class="avatar">
                <avatar
                :avatar-name=regInfo.name
                :is-reader=toggleReady
                @push-filedata=onPushFiledata
                ></avatar>
            </el-col>
        </el-row>

        <i class="iconfont icon-fanhui3 btn-back" @click="toBack"></i>
    </div>
</template>

<script>
import avatar from "@/components/avatar";

export default {
    components: {
        avatar,
    },
    data(){
        let validatePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入密码'))
            } else if (value.length < 6) {
                callback(new Error('太短了 →_→'))
            } else {
                if (this.regInfo.re_password !== '') {
                    this.$refs.form.validateField('re_password');
                }
                callback();
            }
        }
        let validateRePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error("请输入密码"))
            } else if (value !== this.regInfo.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback();
            }
        }
        return {
            // 按钮 loading 状态
            isLoading: false,
            // 通知子组件传值
            toggleReady: false,
            // 接受子组件传递 fileData
            fileData: '',
            // 注册信息
            regInfo: {
                name: '',
                password: '',
                re_password: '',
            },
            // 表单验证规则
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                re_password: [
                    { validator: validateRePass, trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        onPushFiledata(params){
            this.fileData = params;
        },
        submit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.isLoading = true;
                    // 切换状态 通知子组件传值
                    this.toggleReady = !this.toggleReady;
                } else {
                    return false;
                }
            })
        },
        toBack() {
            this.$router.go(-1);
        }
    },
    watch: {
        // 监听子组件传值
        fileData(newValue) {
            let formdata = new FormData();
            // 添加到formdata
            formdata.set('username', this.regInfo.name);
            formdata.set('password', this.regInfo.password);
            formdata.set('avatar', newValue)
            
            this.$ajax.userRegister(formdata).then(response => {
                console.log(response);

                if (response.data.sta == 1) {
                    this.$message.success(response.data.msg);
                    // 带参数跳转到首页
                    this.$router.push({
                        name: 'list',
                        params: {
                            username: this.regInfo.name,
                            password: this.regInfo.password,
                        }
                    })
                } else if (response.data.sta == 0) {
                    this.$message.warning(response.data.msg);
                }
                this.isLoading = false;
            }).catch(error => {
                console.log(error);
                this.isLoading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    width: 800px;
    margin: 80px auto;
    color: #555;
    h2{
        line-height: 2;
        font-weight: normal;
        border-bottom: 1px solid #e1e4e8;
        margin-bottom: 20px;
    }
    .btn-back{
        font-size: 28px;
        position: fixed;
        left: 40px;
        top: 30%;
        cursor: pointer;
    }
}
</style>

