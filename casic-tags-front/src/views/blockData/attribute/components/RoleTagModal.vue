<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="100px" :model="formRole">
      <el-form-item label="块数据根" prop="categoryName">
        <el-input v-model="formRole.categoryName" placeholder="块数据根" />
      </el-form-item>
      <el-form-item label="块数据根ID" prop="categoryName">
        <el-input v-model="formRole.categoryName" placeholder="块数据根ID" />
      </el-form-item>
      <el-form-item label="属性名称" prop="categoryName">
        <el-input v-model="formRole.categoryName" placeholder="属性名称" />
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
      title: '添加块数据属性',
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
          this.title = '编辑块数据属性'
        } else {
          this.title = '添加块数据属性'
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
