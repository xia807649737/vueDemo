<template>
  <div class="pharmacyHomeContent">
    <el-header style="height: 80px;" class="header">
      <div class="headtop">
        <div class="headtop_left">
          <img src="../../assets/images/homeLogo.png" alt="" class="logo">
          <h3 class="logo-text">项目云荟</h3>
        </div>
        <div class="userInfoCon">
          <img v-if="imageUrl != ''" :src="beasUrl + prodApi + imageUrl" alt="" class="user-img">
          <img v-else src="../../assets/images/user-img.jpg" alt="" class="user-img">
          <el-dropdown @command="offCommand">
            <span class="userName">
              {{ nickName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="EditPassWord">修改密码</el-dropdown-item>
              <el-dropdown-item command="quit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 修改密码 -->
    <el-dialog :close-on-press-escape="false" :before-close="closeHandleClose" :close-on-click-modal="closeOnClickModal"
      title="修改密码" :visible.sync="dialogEditPassWordVisible" width="30%" :show-close="showClose">
      <div class="EditPassWordformCon">
        <el-form ref="EditPassWordform" :rules="rules" label-position="right" :model="EditPassWord" label-width="100px">
          <el-form-item label="旧密码：" prop="oldPassword">
            <el-input placeholder="请输入您的旧密码：" autocomplete="off" v-model="EditPassWord.oldPassword"
              show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input placeholder="请输入您的新密码" autocomplete="off" v-model="EditPassWord.newPassword"
              show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码： " prop="okPassword">
            <el-input placeholder="请确认新密码" autocomplete="off" v-model="EditPassWord.okPassword" show-password></el-input>
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



    <!-- 引入子组件，点击更多弹出框分组件来写 -->
    <drawerIndex ref="child"></drawerIndex>
  </div>
</template>

<script>
// 子组件
import drawerIndex from "./drawerIndex.vue";
import { getPharmacy, getHistory, modifyPharmacy, listDrugstock, EditPassWordFun, modifyPharmacyImg, uploadFileOk } from "@/api/home";
import { getToken } from "@/utils/auth";
import { listFeedback, addFeedback, updateFeedback } from "@/api/feedback/feedback";
import { mapState } from 'vuex'
import Cookies from "js-cookie";
export default {
  name: 'PharmacyEndHome',
  props: {},
  components: { drawerIndex },
  data() {
    let checkPasswdRe = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.EditPassWord.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // //密码校验
    let newValValidate = (rule, value, callback) => {
      if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,16}$/g.test(value)) {
        callback()
      } else {
        callback(new Error('请输入包含英文字母大小写、数字和特殊符号的 8-16 位组合'))
      }
    }
    return {
      // 表单验证
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

      prodApi: '/prod-api',
      // 库存导入参数
      upload: {
        // 是否显示弹出层（库存导入）
        open: false,
        // 弹出层标题（库存导入）
        title: "库存导入",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/drugstock/importData"
      },
      limitNum: 1,  // 上传excell时，同时允许上传的最大数
      fileList: [],   // excel文件列表
      apiUrl: process.env.VUE_APP_BASE_URl + '/prod-api/common/upload',//图片上传
      UploadFileUrl: process.env.VUE_APP_BASE_URl + '/drugstock/importData',//上传库存文件
      beasUrl: process.env.VUE_APP_BASE_URl,
      updateSupport: '1',
      stockSearch: '',//查询库存
      userImg: '',
      headers: {
        Authorization: "Bearer " + getToken()
      },
      currentPage: 1,
      pageSize: 5,
      // userImg: 'https://gimg3.baidu.com/yule/src=https%3A%2F%2Fbkimg.cdn.bcebos.com%2Fpic%2F7aec54e736d12f2eb9383637f390c2628535e5ddc213%3Fx-bce-process%3Dimage%2Fresize%2Cm_fill%2Cw_2503%2Ch_2503%2Calign_0%2Climit_0&refer=http%3A%2F%2Fwww.baidu.com&app=2019&size=w931&n=0&g=0n&er=404&q=75&fmt=auto&maxorilen2heic=2000000?sec=1677517200&t=91797dcad8719240f0ce6391d6d90044',//登录人员头像
      history: [],//上传历史记录
      stockData: [ ],
      storeId: -1,//药房ID
      isEditPwd: null,//是否修改过密码
      userName: '',//用户名
      nickName: '',//用户昵称
      editPharmacy: false,
      imageUrl: '',
      // 问题反馈弹窗
      drawer: false,
      direction: 'rtl',
      size: "60%",
      question: {},
      loadProgress: 0, // 动态显示进度条
      progressFlag: false, // 关闭进度条


      //修改密码
      dialogEditPassWordVisible: false,
      showClose: false,
      cancel: false,
      closeOnClickModal: false,
      EditPassWord: {
        oldPassword: '',//旧密码
        newPassword: '', //新密码
        okPassword: '',//确认新密码
      },
      total: 0,//库存总数
    }
  },
  mounted() {
    let isEditPwd = Cookies.get('isEditPwd') //1-已修改过密码 0 -未修改过密码
    this.isEditPwd = isEditPwd
    let storeId = Cookies.get('storeId') == 'null' ? -1 : Cookies.get('storeId') == null ? -1 : Cookies.get('storeId')
    let nickName = Cookies.get('nickName')
    let userName = Cookies.get('userName')
    this.userName = userName
    this.nickName = nickName
    this.storeId = storeId;//药房ID
    if (this.isEditPwd == 0) {
      this.cancel = false
      this.showClose = false
      this.closeOnClickModal = false
      this.dialogEditPassWordVisible = true
    } else {
      this.showClose = true
      this.cancel = true
      this.closeOnClickModal = false
      this.dialogEditPassWordVisible = false
    }
    //只是药房管理端才调用
    if (this.storeId > 0) {
      this.getPharmacy();
      this.getHistory();
      this.listDrugstock();
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    // 更多按钮操作,为子组件传值
    more() {
      this.$refs.child.open()
    },

    //退出，修改密码
    offCommand(command) {
      if (command == "EditPassWord") {
        this.dialogEditPassWordVisible = true
        this.EditPassWord.oldPassword = ''
        this.EditPassWord.newPassword = ''
        this.EditPassWord.okPassword = ''
      }
      if (command == "quit") {
        this.$confirm('确定注销并退出系统吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => { });

      }
    },
    // 取消修改密码
    clearEditPassWord() {
      this.dialogEditPassWordVisible = false
      this.EditPassWord.password = ''
      this.EditPassWord.newPassword = ''
      this.EditPassWord.okPassword = ''
      this.resetForm("EditPassWordform");
    },
    // 确定修改密码
    async okEditPassWord() {
      let that = this
      that.$refs['EditPassWordform'].validate(async (valid) => {
        if (valid) {
          EditPassWordFun(that.EditPassWord).then((response) => {
            console.log(that.EditPassWord);
            if (!response.code !== 200) {
              Cookies.set("isEditPwd", 1,{setSecure:true});
              // this.isEditPwds=1
              that.$message({ message: '密码修改成功', type: 'success' });
              that.dialogEditPassWordVisible = false
            }
          })
        }
      })
    },
    // 修改密码右上角X事件
    closeHandleClose() {
      this.EditPassWord = {}
      this.dialogEditPassWordVisible = false
      this.resetForm("EditPassWordform");
    },
  }
}

var _hmt = _hmt || [];
(function () {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?91018f1ef787f2d8996907345545d647";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();


</script>

<style scoped lang="scss">
.EditPassWordformCon .el-form-item {
  margin-bottom: 22px;
}

.pharmacyHomeContent {
  width: 100%;
  background: rgba(242, 243, 249, 0.39);


  .questionCenterBox {
    border-bottom: 1px solid #dddddd;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20px;
  }

  .title {
    margin: 0;
    font-weight: bold;
  }

  .container {
    padding: 10px;
    box-sizing: border-box;

    .topContent {
      display: flex;
      margin-bottom: 20px;

      .left {
        display: flex;
        // width: calc(100% - 300px);
        width: 100%;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.08);
        margin-right: 20px;

        .pharmacyInformation {
          border-right: 1px solid #EAEAEA;
          padding-left: 45px;
          margin: 14px 0;
          font-size: 16px;
          width: 50%;
          padding-top: 25px;
          padding-right: 15px;

          .pharmacyImgCon {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .pharmacyImg {
              width: 75px;
              height: 75px;
              object-fit: cover;
            }

            .name {
              margin-left: 10px;
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              color: #333333;
            }
          }

          .items {
            height: 45px;
            display: flex;
            align-items: center;

            img {
              margin-right: 5px;
              width: 20px;
              height: 20px;

            }
          }
        }

        .pharmacyInfo {
          font-size: 15px;
          position: relative;
          // width: calc(100% - 400px);
          width: 50%;
          padding-top: 40px;
          padding-left: 55px;
          min-width: 200px;

          .title {
            font-weight: bold;
            color: #333333;
            font-size: 16px;
            // text-align: left;
          }

          ::v-deep .el-table--medium .el-table__cell {
            padding: 10px 0;
            text-align: right;
          }

          .edit {
            position: absolute;
            right: 100px;
            top: 15px;
            cursor: pointer;
            color: #0E70D4;
            font-size: 16px;
          }

          .question {
            position: absolute;
            right: 20px;
            top: 15px;
            cursor: pointer;
            color: #0E70D4;
            font-size: 16px;
          }

          .pharmacyInfoItemCon {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;

            .pharmacyInfoItem {
              width: 50%;
              height: 45px;
            }

            .pharmacyInfoItem1 {
              display: flex;
              justify-content: first baseline;
              width: 100%;
              height: 45px;

              .value1 {
                word-break: break-all
              }
            }
          }
        }
      }

      .right {
        min-width: 300px;
        width: calc(100% - 70%);
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.08);
        padding: 15px 12px 0 12px;
        box-sizing: border-box;

        .title {
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          margin-left: 57px;
        }

        ::v-deep .el-table .cell {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-all;
          line-height: 23px;
          padding-left: 24px;
        }



      }
    }

    .bottomContent {
      box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.08);
      background-color: #fff;
      padding: 10px 30px;
      border-radius: 8px;

      .btnCon {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          span {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-right: 20px;
          }

          a {
            text-decoration: none;
            font-size: 14px;
            font-family: Alibaba PuHuiTi;
            font-weight: 500;
            color: #0E70D4;
          }
        }
      }
    }
  }
}

.header {
  background: url('../../assets/images/homeBg.png') no-repeat;
  height: 80px;
  width: 100%;
  background-size: cover
}

.headtop {
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .headtop_left {
    display: flex;
    align-items: center;

    .logo {
      width: 42px;
      margin-right: 6px;
      object-fit: cover;
    }

    .logo-text {
      font-size: 24px;
      font-family: 'Alibaba PuHuiTi';
      font-weight: bold;
      margin-left: 10px;
      letter-spacing: 1px;
      color: #FFFFFF;
    }
  }

  .userInfoCon {
    display: flex;
    align-items: center;

    .user-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 8px;
    }

    .userName {
      font-size: 15px;
      color: #fff;
    }
  }
}

.el-table {
  font-size: 15px;
  font-family: Microsoft YaHei;
  color: #333333;



}

.historyTable ::v-deep .has-gutter th,
.stockDataTable ::v-deep .has-gutter th {
  background: rgba(250, 250, 254, 0.39);
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}


::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #333;
}

::v-deep .el-pagination {
  white-space: nowrap;
  padding: 12px 5px;
  color: #303133;
  font-weight: 700;
  text-align: right;
}

::v-deep .el-drawer__header {
  align-items: center;
  color: #333;
  display: flex;
  margin-bottom: 20px;
  font-weight: bold;
  padding: 15px 21px 0;
  border-bottom: 1px solid #ddd;
  padding-bottom: 14px;
}

::v-deep .el-input__inner {
  height: 34px;

}

.drawerForm ::v-deep .el-drawer__body {
  padding: 0 20px;

}

.drawerForm h2 {
  border: 1px solid #ddd;
  border-left: 0;
  border-right: 0;
  color: #333;
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 16px;


}

.avatar-uploader {
  margin-left: 30px;
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 136px;
  line-height: 136px;
  text-align: center;
  border: 1px solid #eee;
}

.avatar {
  width: 180px;
  height: 183px;
  object-fit: cover;
  display: block;

}
</style>
