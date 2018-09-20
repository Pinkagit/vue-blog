<template>
    <div class="wrap">
        <el-collapse>
            <el-collapse-item title="用户名" name="username">
                <el-row>
                    <el-col :span="9">
                        <el-input v-model.trim="username" placeholder="新用户名"></el-input>
                    </el-col>

                    <el-col :span="4" :offset="9">
                        <el-button :loading="username_isloading" @click="updateUsername">更改用户名</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="密码" name="password">
                <el-form ref="form" :model="passwordInfo" :rules="rules">
                    <el-row>
                        <el-col :span="9">
                            <el-form-item prop="oldpassword">
                                <el-input type="password" v-model="passwordInfo.oldpassword" placeholder="旧密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <el-form-item prop="newpassword">
                                <el-input type="password" v-model="passwordInfo.newpassword" placeholder="新密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="9">
                            <el-form-item prop="repassword">
                                <el-input type="password" v-model="passwordInfo.repassword" placeholder="再次输入新密码"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="4" :offset="9">
                            <el-button :loading="password_isloading" @click="updatePassword">更改密码</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-collapse-item>

            <el-collapse-item title="头像" name="avatar">
                <el-row>
                    <el-col :span="9">
                        <avatar
                        align="left"
                        btnMsg="选择头像"
                        :sel-canvas=false
                        :is-reader=toggleReady
                        @push-filedata=onPushFiledata
                        ></avatar>
                    </el-col>
                    <el-col :span="4" :offset="9" style="margin-top:220px;">
                        <el-button :loading="avatar_isloading" @click="updateAvatar">更改头像</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import avatar from "@/components/avatar";

export default {
    props: ['userid'],
    components: {
        avatar,
    },
    data() {
        let validatePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入密码'))
            } else if (value.length < 6) {
                callback(new Error('太短了 →_→'))
            } else {
                if (this.passwordInfo.repassword !== '') {
                    this.$refs.form.validateField('repassword');
                }
                callback();
            }
        }
        let validateRePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error("请输入密码"))
            } else if (value !== this.passwordInfo.newpassword) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback();
            }
        }
        
        return {
            // 表单验证
            rules: {
                oldpassword: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                newpassword: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                repassword: [
                    { validator: validateRePass, trigger: 'blur' }
                ]
            },
            // 账号
            username: '',
            // 密码
            passwordInfo: {
                oldpassword: '',
                newpassword: '',
                repassword: '',
            },
            // 按钮loading状态
            username_isloading: false,
            password_isloading: false,
            avatar_isloading: false,
            // 通知子组件传值
            toggleReady: false,
            //
            fileData: '',
        }
    },
    created(){
        
    },
    methods: {
        updateUsername() {
            this.username_isloading = true;

            if (!this.username) {
                this.$message.warning("请输入用户名！");
                return;
            } else if (this.username == this.$store.state.USERNAME) {
                this.$message.warning("请输入新的用户名！");
                return;
            }

            let nameInfo = {
                oldusername : this.$store.state.USERNAME,
                newusername : this.username,
            }
            
            this.$ajax.updateUsername(nameInfo).then(response => {
                console.log(response);

                if (response.data.sta) {
                    this.$message.success(response.data.msg)
                    // 更新 store.USERNAME
                    this.$store.commit('SET_USERNAME', response.data.newusername);
                    // 跳转到首页
                    this.$router.push('/')
                    
                } else {
                    this.$message.error(response.data.msg)
                }
                
                this.username_isloading = false;
            }).catch(error => {
                console.log(error);
                this.username_isloading = false;
            })
            
            
        },
        updatePassword() {
            console.log("passwordInfo=>", this.passwordInfo);
            
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.password_isloading = true;

                    let passwordinfo = {
                        oldpassword: this.passwordInfo.oldpassword,
                        newpassword: this.passwordInfo.newpassword,
                        userid: this.userid
                    }

                    console.log("passwordinfo==>", passwordinfo);
                    
                    this.$ajax.updatePassword(passwordinfo).then(response => {
                        console.log(response);

                        if (response.data.sta == 1) {
                            this.$message.success(response.data.msg);
                        } else {
                            this.$message.error(response.data.msg);
                        }
                        this.password_isloading = false;
                        
                    }).catch(error => {
                        console.log(error);
                        this.password_isloading = false;
                    })
                } else {
                    return false;
                }
            })
            
            
        },
        updateAvatar() {
            this.avatar_isloading = true;
            this.toggleReady = !this.toggleReady;
        },
        // 接受fileData
        onPushFiledata(params){
            this.fileData = params;
        }
    },
    watch: {
        fileData(newValue) {
            // 更新头像
            let formdata = new FormData();
        
            formdata.set(this.userid, newValue);
            formdata.set('username', this.$store.state.USERNAME);

            this.$ajax.updateAvatar(formdata).then(response => {
                console.log("updateAvatar==>", response);

                if (response.data.sta == 1) {
                    this.$message.success("上传成功！")
                } else {
                    this.$message.warning("失败！")
                }
                this.avatar_isloading = false;
            }).catch(error => {
                console.log(error);
                this.avatar_isloading = true;
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    width: 100%;
    height: 100px;
}
</style>

