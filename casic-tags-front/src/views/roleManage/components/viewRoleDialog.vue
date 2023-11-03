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
      <!-- <el-form-item label="系统名称" prop="cname">
        <el-input v-model="formRole.cname" placeholder="请输入系统名称" />
      </el-form-item> -->
      <el-form-item label="角色组名称" prop="cname">
        <el-input v-model="formRole.cname" :disabled="true" placeholder="请输入角色组名" />
      </el-form-item>
      <el-form-item label="备注" prop="cdetail">
        <el-input v-model="formRole.cdetail" :disabled="true" :rows="5" type="textarea" placeholder="角色描述" />
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
      default: '新增角色组'
    }
  },
  data() {
    return {
      formRole: {},
      rules: {
        // name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        // regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = this.data
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('cancel')
      // this.$refs.userForm.validate(valid => valid && this.$emit('ok', this.formRole))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  text-align: center;
}
</style>
