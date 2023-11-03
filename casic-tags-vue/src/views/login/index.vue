<template>
  <div style="height:100%;">
    <div class="logo-title">
      <div class="logo-title-content">
        <img src="../../assets/login_png/logo.png" alt="">
        <span>社会治理人口事件管理系统</span>
      </div>
    </div>
    <div class="login-container">
      <div class="login-mask">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">用户登录</h3>
          </div>
          <el-form-item label="账号:" label-width="60px" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入登录账号" />
          </el-form-item>
          <el-form-item label="密码:" label-width="60px" prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入登录密码"
              name="password"
              show-password
            />
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 100%; margin-bottom: 15px"
            @click="handleLogin"
          >登录</el-button>
          <div style="display: flex; justify-content: center; width: 100%">
            <el-checkbox v-model="loginForm.remember" label="记住登录状态" name="type" />
          </div>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>
// import { getAuthToken } from '@/api/event-api/eventTypeSearch'
import { setToken } from '@/utils/auth'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      // if (!reg.test(value)) {
      //   callback(new Error('密码应由6-20位的数字和字母组成！'))
      // } else {
      //   callback()
      // }
      if (!value) {
        callback(new Error('请输入密码'))
      // } else if (value.length < 6) {
      //   callback(new Error('请输入6位以上密码！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      name: '',
      passwordType: 'password',
      redirect: undefined
    }
  },
  created() {},
  methods: {
    // async getAuthToken() {
    //   const res = await getAuthToken()
    //   if (res.code === 200) {
    //     Cookies.set('token', res.body)
    //   }
    // },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.username === 'admin' && this.loginForm.password === '123456') {
            setToken('admin')
            // this.getAuthToken()
            this.$router.push({ path: '/' })
          } else {
            this.$message.error('账号或密码错误！')
          }
          this.loading = false
          // const data = {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // }
          // Cookies.set('userList', userList, { expires: 365 })
          // login(data)
          //   .then((res) => {
          //     if (res.code === 200) {
          //       this.name = res.user.name
          //       localStorage.setItem('userName', this.name)
          //       this.$message.success('登录成功！')
          //       setToken(res.token)
          //       this.$router.push({ path: '/', query: { name: this.name }})
          //       this.loading = false
          //     } else {
          //       this.$message.error(res.mag)
          //       this.loading = false
          //     }
          //   })
          //   .catch(() => {
          //     this.loading = false
          //   })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.logo-title {
  height: 20%;
  .logo-title-content {
    height: 100%;
    padding: 4% 0 0 3%;
    img {
      width: 60pt;
      height: 41pt;
      vertical-align: middle;
    }
    span {
      margin-left: 10px;
      color: #333333;
      font-family: Microsoft YaHei;
      font-size: 26pt;
      font-weight: bold;
      height: 41pt;
      line-height: 41pt;
      vertical-align: middle;
    }
  }
}
.login-container {
  min-height: 65%;
  height: 65%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-image: url(../../assets/Loginbg.png);
  background-size: cover;
  overflow: hidden;
  .login-mask {
    width: 31%;
    height: 55%;
    min-height: 320px;
    border-radius: 5px;
    margin: 0 auto;
    position: absolute;
    left: 75%;
    top: 55%;
    margin-left: -15%;
    margin-top: -15%;
    background-color: #eee;
    opacity: 0.9;
  }
  .login-form {
    position: relative;
    width: 90%;
    margin: 0 auto;
    max-width: 100%;
    padding: 60px 35px 20px 20px;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    margin: 0;
    .title {
      font-family: Alibaba PuHuiTi;
      font-size: 20pt;
      color: #283443;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
