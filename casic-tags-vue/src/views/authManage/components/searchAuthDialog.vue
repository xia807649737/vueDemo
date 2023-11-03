<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="userForm" label-position="right" :rules="rules" label-width="100px" :model="formRole">
      <!-- <el-form-item label="系统名称：" prop="sysType" placeholder="请选择系统名称">
        <el-select v-model="formRole.sysType" style="width: 100%">
          <el-option value="1" label="法制邮局" />
          <el-option value="2" label="通讯底板" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="角色组名：" prop="cName">
        <el-input v-model="formRole.cName" placeholder="请输入角色组名" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'SearchRoleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formRole: {},
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
        this.formRole = {}
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formRole))
    }
  }
}
</script>
