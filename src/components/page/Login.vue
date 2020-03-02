<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">管理系统</div>
            <el-form :model="user" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userName" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur'}]">
                    <el-input v-model="user.userName" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password"  :rules="[{ required: true, message: '请输入用户密码', trigger: 'blur'}]">
                    <el-input type="password"
                            placeholder="用户密码"
                            @keyup.enter.native="loginForm(user)"
                            v-model.trim="user.password">

                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="loginForm(user)">登录</el-button>
                    <el-button type="primary" @click="registerForm()">注册</el-button>
                </div>
                <p class="login-tips">Tips : 如没登录账号请先前往注册账号</p>
            </el-form>
        </div>

        <!-- 新增弹出框 -->
        <el-dialog title="注册用户信息" :visible.sync="registerVisible" width="30%">
            <el-form :model="ruleForm" status-icon :rules="registerRules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="用户名" prop="userName" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur'}]" style="position: relative;left: 5%">
                    <el-input type="userName" v-model="ruleForm.userName" clearable autocomplete="off" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name" :rules="[{ required: true, message: '请输入本人姓名', trigger: 'blur'}]" style="position: relative;left: 5%">
                    <el-input type="name" v-model="ruleForm.name" clearable autocomplete="off" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" style="position: relative;left: 5%">
                    <el-input type="password" v-model="ruleForm.password" clearable autocomplete="off" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass" style="position: relative;left: 5%">
                    <el-input type="password" v-model="ruleForm.checkPass" clearable autocomplete="off" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="telePhone" :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur'}]" style="position: relative;left: 5%">
                    <el-input type="telePhone" v-model="ruleForm.telePhone" clearable autocomplete="off" style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" style="position: relative;left: 5%">
                    <el-radio-group v-model="ruleForm.sex">
                        <el-radio label="1" >男</el-radio>
                        <el-radio label="0" >女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        prop="email"
                        label="邮箱"
                        :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]" style="position: relative;left: 5%">
                    <el-input v-model="ruleForm.email" clearable autocomplete="off"  style="width: 60%"></el-input>
                </el-form-item>
                <el-form-item style="position: relative;left: 5%">
                    <el-button type="primary" @click="commitRegisterForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                    <el-button type="primary" @click="cencelRegister('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import * as API from '../../api';

    export default {
        data: function() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                registerVisible: false,
                user: {
                    userName: '',
                    password: ''
                },
                ruleForm: {
                    password: '',
                    checkPass: '',
                    userName: '',
                    name: '',
                    telePhone: '',
                    sex: 0,
                    email: '',

                },
                registerRules: {
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                },
                addUser:{

                }
            };

        },
        methods: {
            loginForm(user) {
                debugger
                this.$refs.login.validate(valid => {
                    if (valid) {
                        debugger
                        API.user_Login(user).then(res => {
                            debugger
                            if (res.body.userName == null || res.body.telePhone == null) {
                                this.$message.error('用户名或密码错误，请重新登录');
                            }else{
                                this.$message.success('登录成功');
                                localStorage.setItem('ms_username', this.user.userName);
                                this.$router.push('/');
                            }
                        });
                    } else {
                        this.$message.error('请输入账号和密码');
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            registerForm() {
                this.registerVisible = true;
            },
            commitRegisterForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        API.user_Register(this.ruleForm).then(res => {
                            debugger
                            if (res.body == true) {
                                this.$message({
                                    message: '恭喜你，注册成功！',
                                    type: 'success',
                                });
                                this.$refs[formName].resetFields();
                       this.registerVisible=false;
                            }else{
                                this.$message.error('该用户已被注册，请重新注册或直接登录');
                            }
                       });
                    } else {
                        console.log('录入信息异常，提交失败!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            cencelRegister(formName) {
                this.$refs[formName].resetFields();
                this.registerVisible=false;
            },

        }
    };


</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 40%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

</style>
