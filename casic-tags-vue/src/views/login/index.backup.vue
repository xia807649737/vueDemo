<template>
  <div class="login-container">
    <div class="login-mask">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <h3 class="title">自然人颗粒化管理系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <!-- <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入用户名或手机号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          /> -->
          <el-autocomplete
            v-model="loginForm.username"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入用户名"
            @select="handleSelect"
          >
            <template slot-scope="{ item }">
              <div class="name">{{ item.username }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType == 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-checkbox v-model="loginForm.remember" label="记住用户名和密码" name="type" style="margin-bottom:15px " />
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click="handleLogin">登录</el-button>

        <div class="tips" />
      </el-form>
    </div>
    <div class="copyRight">
      <span>CopyRight © 2021 深圳市政法委</span>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import { login } from '@/api/login'
import { setToken } from '@/utils/auth'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else
      if (parseFloat(value).toString() !== 'NaN' && value.length !== 11) {
        callback(new Error('请输入11位手机号码'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!reg.test(value)) {
        callback(new Error('密码应由6-20位的数字和字母组成！'))
      } else {
        callback()
      }
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('请输入6位以上密码！'))
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
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleSelect(item) {
      this.loginForm.username = item.username
      this.loginForm.password = item.password
    },
    querySearch(queryString, cb) {
      let userList = []
      if (Cookies.get('userList')) {
        userList = JSON.parse(Cookies.get('userList'))
      }
      cb(userList)
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
          let userList = []
          if (Cookies.get('userList')) {
            userList = JSON.parse(Cookies.get('userList'))
          }
          let isflag = false
          userList.some((item, index) => {
            if (item.username === this.loginForm.username) {
              userList[index].password = this.loginForm.password
              isflag = true
              return true
            }
          })
          if (!isflag && this.loginForm.remember) {
            userList.push(data)
          }
          Cookies.set('userList', userList, { expires: 365 })
          login(data).then((res) => {
            if (res.code === 200) {
              this.name = res.user.name
              localStorage.setItem('userName', this.name)
              this.$message.success('登录成功！')
              setToken(res.token)
              this.$router.push({ path: '/', query: { name: this.name }})
              this.loading = false
            } else {
              this.$message.error(res.mag)
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-color: #fff;
  .el-input {
    display: inline-block;
    height: 30px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 8px 5px 12px 15px;
      color: #889aa4;
      height: 30px;
      caret-color: #889aa4;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $light_gray inset !important;
        -webkit-text-fill-color: #889aa4 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #889aa4;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    height: 49px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-image: url(../../assets/Loginbg.png);
  background-size: cover;
  overflow: hidden;
.login-mask{
  width: 450px;
  height:380px;
  border-radius:5px ;
  margin: 0 auto;
  position: absolute;
 left: 50%;
 top: 50%;
 margin-left:-225px;
margin-top:-220px;
  background-color: #fff;

}
  .login-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 60px 35px 20px 20px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
margin:0;
    .title {
      font-family: Alibaba PuHuiTi;
      font-size: 26px;
      color: #283443;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }
.copyRight{
  height:66px;
  width:100%;
  background: #316ABC;
  color: #fff;
  opacity: 1;
  text-align: center;
  padding: 20px 0;
  position:fixed;
  bottom:0;
  font-size: 15px;
font-family: Microsoft YaHei;
font-weight: 400;
}
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
