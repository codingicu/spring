const app = new Vue({
    data() {
        let validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (value !== this.logonForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                }
                callback();
            }
        }
        return {
            activeTab: 'logon',
            codeURL: 'code/' + new Date().getTime(),
            logonForm: {
                username: null,
                password: null,
                rePassword: null,
                code: null,
            },
            rulesLogon: {
                username: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 8, max: 32, message: '长度在 8 到 32 个字符', trigger: 'blur'}
                ],
                rePassword: [
                    {validator: validatePassword, trigger: 'blur'},
                    {required: true, message: '请输入重复密码', trigger: 'blur'},
                    {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: '请输入验证码', trigger: 'blur'},
                    {min: 4, max: 4, message: '长度 4 个字符', trigger: 'blur'}
                ],
            },
            rulesLogin: {
                username: [
                    {required: true, message: '请输入账号', trigger: 'blur'},
                    {min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 8, max: 32, message: '长度在 8 到 32 个字符', trigger: 'blur'}
                ],
                code: [
                    {required: true, message: '请输入验证码', trigger: 'blur'},
                    {min: 4, max: 4, message: '长度 4 个字符', trigger: 'blur'}
                ],
            },
            loginForm: {
                username: null,
                password: null,
                code: null,
            },
            disabled: true,
            fileMaxSize: 500,
            uploadURL: 'home/upload',
            downloadURL: 'home/download',

        }
    },
    methods: {
        codeFlush() {
            this.codeURL = 'code/' + new Date().getTime();
        },
        clickLogon(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/logon', this.logonForm, {
                        baseURL: 'http://localhost:8080/webmvc'
                    })
                        .then((response) => {
                            const body = response.data;
                            if (body.status) {
                                this.$message.success('注册成功');
                                this.logonForm = {
                                    username: null,
                                    password: null,
                                    rePassword: null,
                                    code: null,
                                };
                            } else {
                                this.codeFlush();
                                this.logonForm.code = null;
                                this.$message.warning(body.info)
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        clickLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/login', this.loginForm, {
                        baseURL: 'http://localhost:8080/webmvc'
                    })
                        .then((response) => {
                            const body = response.data;
                            if (body.status) {
                                this.$message.success('登录成功');
                                this.loginForm = {
                                    username: null,
                                    password: null,
                                    code: null,
                                };
                                this.disabled = !this.disabled;
                            } else {
                                this.codeFlush();
                                this.loginForm.code = null;
                                this.$message.warning(body.info)
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        clickLogout() {
            axios.get('/logout', {
                baseURL: 'http://localhost:8080/webmvc'
            })
                .then(() => {
                    this.$message.success('已注销');
                    this.disabled = !this.disabled;
                });
        },
        uploadBefore(file) {
            if (file.size > 1024 * this.fileMaxSize) {
                this.$notify.error({
                    title: '系统通知: ',
                    message: '文件太大: ' + Math.ceil(file.size / 1024) + 'kb',
                });
                return false;
            }
            return true;
        },
        uploadSuccess(response, file, fileList) {
            if (response.status) {
                this.$notify.success({
                    title: '系统通知: ',
                    message: '上传成功',
                });
            } else {
                this.$notify.error({
                    title: '系统通知: ',
                    message: '上传成功',
                });
            }
        },
        uploadError(err, file, fileList) {
            this.$notify.error({
                title: '系统通知: ',
                message: '上传失败(' + err.data + ')',
            });
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        fileDownload() {
            axios.get('home/download/中文.woff', this.logonForm, {
                baseURL: 'http://localhost:8080/webmvc/'
            })
                .then((response) => {
                    const headers = response.headers;
                    const file = response.headers['content-disposition'].split("attachment; filename*=UTF-8''")[1];
                    if (headers['content-type'] === 'application/octet-stream;charset=utf-8') {
                        const blob = new Blob([response.data]);
                        const link=document.createElement('a');
                        link.download=decodeURI(file);
                        link.style.display='none';
                        link.href=URL.createObjectURL(blob);
                        document.body.append(link);
                        link.click();
                        URL.revokeObjectURL(link.href);
                        document.body.removeChild(link);
                    }
                    else {
                        this.$notify.error({
                            title: '系统通知: ',
                            message: '下载失败(' + response.data + ')',
                        });
                    }
                });
        },
    }
}).$mount('#app');