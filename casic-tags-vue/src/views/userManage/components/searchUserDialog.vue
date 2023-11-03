<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="userForm" label-position="right" :rules="rules" label-width="100px" :model="formUser">
      <!-- <el-form-item label="系统名称" prop="sysType">
        <el-select v-model="formUser.sysType" :disabled="title === '修改用户'" style="width: 100%">
          <el-option value="1" label="法制邮局" />
          <el-option value="2" label="通讯底板" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="姓名" prop="cName">
        <el-input v-model="formUser.cName" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="用户名" prop="cUsername">
        <el-input v-model="formUser.cUsername" placeholder="请输入用户名" />
      </el-form-item>
      <!-- <el-form-item label="单位" prop="cCorp">
        <el-input v-model="formUser.cCorp" placeholder="请输入单位名称" />
      </el-form-item> -->
      <!-- <el-form-item label="部门" prop="cDept">
        <el-select v-model="formUser.cDept" style="width: 100%">
          <el-option value="政法事业部" label="政法事业部" />
          <el-option value="成都研发中心" label="成都研发中心" />
          <el-option value="民用市场部" label="民用市场部" />
          <el-option value="武汉研发中心" label="武汉研发中心" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'SearchUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formUser: {},
      rules: {
        // name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        // regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      },
      title: '查询'
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formUser = {}
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formUser))
    }
  }
}
</script>
