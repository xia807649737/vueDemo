<template>
  <div class="navbar">
    <div class="logoContent">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />
      <img src="../../assets/images/homeLogo.png" alt="">
      <h2>项目云荟</h2>
    </div>
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/> -->

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar" class="user-avatar"> -->
          <!-- <img style="width: 40; height: 40px;" src="../../assets/images/profile.jpg" alt=""> -->
          <img src="../../assets/images/user-img.jpg" alt="" class="user-img">

          <span style="padding:  0 8px;color: #333;font-size: 15px;">{{ nickName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item @click.native="EditPassWord">修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码 -->
      <el-dialog :before-close="beforeClose" :close-on-press-escape="false" title="修改密码" :visible.sync="dialogFormVisible"
        width="30%" :show-close="close">
        <div class="EditPassWordformCon">
          <el-form ref="EditPassWordform" :rules="rules" label-position="right" :model="EditPassWordData"
            label-width="100px">
            <el-form-item label="旧密码：" prop="oldPassword">
              <el-input placeholder="请输入您的旧密码：" autocomplete="off" v-model="EditPassWordData.oldPassword"
                show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
              <el-input placeholder="请输入您的新密码" autocomplete="off" v-model="EditPassWordData.newPassword"
                show-password></el-input>
            </el-form-item>
            <el-form-item label="确认新密码： " prop="okPassword">
              <el-input placeholder="请确认新密码" autocomplete="off" v-model="EditPassWordData.okPassword"
                show-password></el-input>
            </el-form-item>
          </el-form>
          <div v-if="isEditPwd == 0" style="color:red;">
            <p>说明：请修改您的初始密码</p>
            <p>注意:必须包含英文字母大小写、数字和特殊符号的 8-16 位组合</p>
          </div>
          <div v-else style="color:red;">请输入包含英文字母大小写、数字和特殊符号的 8-16 位组合的密码</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="clearEditPassWord" v-if="this.cancel">取 消</el-button>
          <el-button type="primary" @click="okEditPassWord('EditPassWordform')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { EditPassWordFun } from "@/api/home"
import resetPwd from '../../views/system/user/profile/resetPwd.vue'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import Cookies from "js-cookie";

export default {
  components: {
    resetPwd,
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {
    let checkPasswdRe = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.EditPassWordData.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    //密码校验
    let newValValidate = (rule, value, callback) => {
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$/g.test(value)) {
        callback()
      } else {
        callback(new Error('请输入包含英文字母大小写、数字和特殊符号的 8-16 位组合'))
      }
    }
    return {
      dialogFormVisible: false,
      EditPassWordData: {
        oldPassword: '',//旧密码
        newPassword: '', //新密码
        okPassword: '',//确认新密码
      },
      userName: '',//用户名
      nickName: '',//用户昵称
      isEditPwd: 0,
      cancel: false,
      close: false,
      beasUrl: process.env.VUE_APP_BASE_URl,
      prodApi: '/prod-api',
      rules: {
        oldPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        newPassword: [
          {
            min: 8,
            max: 16,
            message: '长度应在 8 到 16 个字符',
            trigger: 'change'
          },
          {
            required: true,
            validator: newValValidate,
            trigger: 'blur'
          }
        ],
        okPassword: [
          { validator: checkPasswdRe, trigger: 'change' }
        ]
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  mounted() {
    let isEditPwd = Cookies.get('isEditPwd') //1-已修改过密码 0 -未修改过密码
    this.isEditPwd = isEditPwd
    let nickName = Cookies.get('nickName')
    let userName = Cookies.get('userName')
    this.userName = userName
    this.nickName = nickName
    if (isEditPwd == 0) {
      this.dialogFormVisible = true
    } else {
      this.close = true
      this.cancel = true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          Cookies.remove("username");
          Cookies.remove("password");
          Cookies.remove('rememberMe');
          location.href = '/web/index';
        })
      }).catch(() => { });
    },
    EditPassWord() {
      this.dialogFormVisible = true
    },
    // 取消修改密码
    clearEditPassWord() {
      this.dialogFormVisible = false
      this.EditPassWordData = {}
      this.resetForm('EditPassWordform')
    },
    // 确定修改密码
    okEditPassWord() { },
    okEditPassWord() {
      this.$refs["EditPassWordform"].validate(valid => {
        if (valid) {
          EditPassWordFun(this.EditPassWordData).then(response => {
            this.$modal.msgSuccess("修改成功");
            Cookies.set("isEditPwd", 1, { setSecure: true });
          });
        }
      });
    },
    // 修改密码右上角X事件
    beforeClose() {
      this.dialogFormVisible = false
      this.EditPassWordData = {}
      this.resetForm('EditPassWordform')
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

.user-img {
  width: 40px;
  height: 40px;
}

.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logoContent {
    display: flex;
    align-items: center;

    img {
      width: 40px;
    }

    h2 {
      font-size: 24px;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      line-height: 32px;
      color: #0E70D4;
      margin-left: 6px;
    }
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;

        }

        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
