<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="unitForm" label-position="right" :rules="rules" label-width="100px" :model="formUnit">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="formUnit.deptName" placeholder="请输入部门名称" />
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
  name: 'SearchUnitDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formUnit: {},
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
        this.formUnit = {}
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.unitForm.validate(valid => valid && this.$emit('ok', this.formUnit))
    }
  }
}
</script>
