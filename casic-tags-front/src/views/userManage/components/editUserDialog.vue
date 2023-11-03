<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="userForm" label-position="right" :rules="rules" label-width="80px" :model="formUser">
      <!-- <el-form-item label="系统名称" prop="sysType">
        <el-select v-model="formUser.sysType" :disabled="title === '修改用户'" style="width: 100%" @change="getSelectOptions">
          <el-option value="1" label="法制邮局" />
          <el-option value="2" label="通讯底板" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="姓名" prop="cname">
        <el-input v-model="formUser.cname" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="用户名" prop="cusername">
        <el-input v-model="formUser.cusername" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="cpassword">
        <el-input v-model="formUser.cpassword" show-password placeholder="请输入密码" clearable />
      </el-form-item>
      <!-- <el-form-item label="单位" prop="ccorp">
        <el-input v-model="formUser.ccorp" placeholder="请输入单位名称" />
      </el-form-item> -->
      <el-form-item label="部门" prop="cdept">
        <el-select v-model="formUser.cdept" style="width: 100%">
          <el-option value="政法事业部" label="政法事业部" />
          <el-option value="成都研发中心" label="成都研发中心" />
          <el-option value="民用市场部" label="民用市场部" />
          <el-option value="武汉研发中心" label="武汉研发中心" />
        </el-select>
      </el-form-item>

      <el-form-item label="用户类型" prop="ctype">
        <el-select v-model="formUser.ctype" style="width: 100%">
          <el-option value="ADMIN" label="系统管理员" />
          <el-option value="USER" label="普通用户" />
        </el-select>
      </el-form-item>

      <el-form-item label="角色组" prop="croleId">
        <el-select v-model="formUser.croleId" style="width: 100%" @change="setRoleName">
          <el-option
            v-for="item in rolesOptions"
            :key="item.cid"
            :label="item.cname"
            :value="item.cid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="cdetail">
        <el-input v-model="formUser.cdetail" :rows="5" type="textarea" placeholder="角色描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getRolesList, getRoleInfo, addRoleInfo, editRoleInfo, deleteRoles, getRolesByName } from '@/api/roleManage'
export default {
  name: 'EditUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '新增用户'
    }
  },
  data() {
    return {
      formUser: {},
      rules: {
        cname: [{ required: true, message2: '姓名', trigger: 'blur', validator: this.validateString_Number }],
        cusername: [{ required: true, message2: '用户名', trigger: 'blur', validator: this.validateStringAndChinese }],
        cpassword: [{ required: true, message2: '密码', trigger: 'blur', validator: this.validateString_Number }],
        cdept: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        ctype: [{ required: true, message: '请输入用户类型', trigger: 'blur' }],
        croleId: [{ required: true, message: '请选择角色组', trigger: 'blur' }]
      },
      rolesOptions: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formUser = { ...this.data }
        // 获取角色列表
        this.getRolesList()
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formUser))
    },
    getSelectOptions() {
      this.getRolesList()
    },
    setRoleName(value) {
      this.formUser.crole = this.rolesOptions.find(item => item.cid === value)?.cname
    },
    // 查看角色列表数据
    async getRolesList() {
      const data = {
        sysType: this.formUser.sysType || '0',
        currentPage: 1,
        pageSize: 1000
      }
      getRolesList(data).then(res => {
        this.rolesOptions = res.result.list || []
      })
    },
    validateString_Number(rule, value, callback) {
      const reg = /^[0-9A-Za-z_]{3,16}$/
      if (!value) {
        callback(new Error('请输入' + rule.message2))
      } else {
        if (!reg.test(value.trim())) {
          callback(new Error(rule.message2 + '应由3-16位以内的字母、数字、下划线组成！'))
        } else {
          callback()
        }
      }
    },
    validateStringAndChinese(rule, value, callback) {
      const reg = /^[\u4E00-\u9FA5A-Za-z_]{2,16}$/
      if (!value) {
        callback(new Error('请输入' + rule.message2))
      } else {
        if (!reg.test(value.trim())) {
          callback(new Error(rule.message2 + '应由2-16位以内的中文和字母组成！'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>
