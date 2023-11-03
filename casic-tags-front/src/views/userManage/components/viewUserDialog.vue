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
      <el-form-item label="姓名" prop="cname">
        <el-input v-model="formUser.cname" :disabled="true" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="用户名" prop="cusername">
        <el-input v-model="formUser.cusername" :disabled="true" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="cpassword">
        <el-input v-model="formUser.cpassword" :disabled="true" show-password placeholder="请输入密码" />
      </el-form-item>
      <!-- <el-form-item label="单位" prop="ccorp">
        <el-input v-model="formUser.ccorp" placeholder="请输入单位名称" />
      </el-form-item> -->
      <el-form-item label="部门" prop="cdept">
        <el-select v-model="formUser.cdept" disabled style="width: 100%">
          <el-option value="政法事业部" label="政法事业部" />
          <el-option value="成都研发中心" label="成都研发中心" />
          <el-option value="民用市场部" label="民用市场部" />
          <el-option value="武汉研发中心" label="武汉研发中心" />
        </el-select>
      </el-form-item>

      <el-form-item label="用户类型" prop="ctype">
        <el-select v-model="formUser.ctype" disabled style="width: 100%">
          <el-option value="ADMIN" label="系统管理员" />
          <el-option value="USER" label="普通用户" />
        </el-select>
      </el-form-item>

      <el-form-item label="角色组" prop="croleId">
        <el-select v-model="formUser.croleId" disabled style="width: 100%">
          <el-option
            v-for="item in rolesOptions"
            :key="item.cid"
            :label="item.cname"
            :value="item.cid"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="cdetail">
        <el-input v-model="formUser.cdetail" :disabled="true" :rows="5" type="textarea" placeholder="角色描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getRolesList } from '@/api/roleManage'
export default {
  name: 'ViewUserDialog',
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
      formUser: {
        name: '',
        regionLevel: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      },
      rolesOptions: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formUser = this.data
        this.getRolesList()
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('cancel')
      // this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formUser))
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  text-align: center;
}
</style>
