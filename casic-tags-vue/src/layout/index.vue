<template>
  <div :class="classObj" class="app-wrapper">
    <div class="main-top">
      <span class="top-title" style="position: relative;z-index:9999;margin-left:20px;font-size: 20px;">自然人颗粒化管理系统</span>
      <span class="top-image" style="position: relative;z-index:10000;margin-left:3px;font-size: 20px;" />
      <!--
      <span class="loginout">
        <a> <i class="el-icon-switch-button" style="margin-right:10px; margin-top: 4px; color: #333333;" @click="logout" /></a>
      </span>
      -->
      <span style="float:right;font-size:18px;color:#333333">
        <el-dropdown class="avatar-container">
          <span style="float:right;font-size:16px;color:#333333;margin-top:5px;margin-right: 20px">{{ userName || 'admin' }} </span>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item>
              <span style="display:block;" @click="changepassword">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
      :close-on-click-modal="false"
      @closed="close('ruleForm')"
    >
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" />
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close('ruleForm')">关闭</el-button>
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </span>
    </el-dialog>
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { modifyPassword, logout } from '@/api/login'
import { removeToken } from '@/utils/auth'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      }
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!reg.test(value)) {
        callback(new Error('密码应由6-20位的数字和字母组成！'))
      } else {
        callback()
      }
      if (this.ruleForm.checkPass !== '') {
        this.$refs.ruleForm.validateField('checkPass')
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userName: '',
      centerDialogVisible: false,
      ruleForm: {
        newPassword: '',
        checkPass: '',
        oldPassword: ''
      },
      rules: {
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.userName = localStorage.getItem('userName')
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // async logout() {
    //   await this.$store.dispatch('user/logout')
    //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    // },
    logout() {
      removeToken()
      // logout().then(res => {
      //   if (res.code === 200) {
      //     removeToken()
      //     this.$router.push('/login')
      //     // localStorage.removeItem('userName')
      //   }
      // })
    },
    changepassword() {
      removeToken()
      window.location.href = '/app/qualification-examination/#/login?systemName=label'
      // this.$message.warning('功能开发中...')
      // this.centerDialogVisible = true
      // this.ruleForm.oldPassword = ''
      // this.ruleForm.newPassword = ''
      // this.ruleForm.checkPass = ''
    },
    // 取消
    close(formName) {
      this.$refs[formName].resetFields()
      this.centerDialogVisible = false
      this.ruleForm.oldPassword = ''
      this.ruleForm.newPassword = ''
      this.ruleForm.checkPass = ''
    },
    // 修改提交密码
    submitForm(formName) {
      const data = {
        oldPassword: this.ruleForm.oldPassword,
        newPassword: this.ruleForm.newPassword
      }
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          // this.centerDialogVisible = false
          return false
        } else {
          modifyPassword(data).then(res => {
            if (res.code === 200) {
              this.$message.success('修改成功！')
              this.$refs[formName].resetFields()
            } else {
              this.$message.error(res.msg)
              this.$refs[formName].resetFields()
            }
          })
          this.centerDialogVisible = false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .top-image {
    display: none
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .main-top{
    background-color:#177DDD;
    height:50px;
    width: 100%;
    color: #ffffff;
    z-index: 999;
    font-size: 22px;
    padding-top: 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  .loginout{
    width:60px;
    margin:0 10px;
    float: right;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;

  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
