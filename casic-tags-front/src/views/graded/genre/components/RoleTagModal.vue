<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="80px" :model="formRole">
      <el-form-item label="类别名称" prop="categoryName">
        <el-input v-model="formRole.categoryName" placeholder="类别名称" />
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
  name: 'RoleTagModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '添加类别',
      formRole: {
        categoryName: ''
      },
      rules: {
        categoryName: [{ required: true, message: '请输入类别名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = this.data
        if (this.formRole.categoryId) {
          this.title = '编辑类别'
        } else {
          this.title = '添加类别'
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => valid && this.$emit('ok', this.formRole))
    }
  }
}
</script>
